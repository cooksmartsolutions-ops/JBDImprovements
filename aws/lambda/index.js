import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { randomUUID } from "crypto";

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const ses = new SESClient({ region: process.env.AWS_REGION });

const TABLE_NAME    = process.env.TABLE_NAME    || "jbd-leads";
const NOTIFY_EMAIL  = process.env.NOTIFY_EMAIL  || "JBDImprovement@gmail.com";
const FROM_EMAIL    = process.env.FROM_EMAIL    || "JBDImprovement@gmail.com";
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET; // set in Lambda env vars

export const handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return corsResponse(200, {});
  }

  try {
    const body = JSON.parse(event.body || "{}");

    const {
      firstName,
      lastName,
      phone,
      email,
      service,
      consultationDate,
      preferredTime,
      description,
      recaptchaToken,
    } = body;

    // Basic validation
    if (!firstName || !lastName || !phone || !service) {
      return corsResponse(400, { error: "Missing required fields." });
    }

    // reCAPTCHA v3 verification (fail-open — if Google is unreachable, let it through)
    if (RECAPTCHA_SECRET && recaptchaToken) {
      try {
        const verifyRes = await fetch(
          `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${recaptchaToken}`,
          { method: "POST", signal: AbortSignal.timeout(4000) }
        );
        const verifyData = await verifyRes.json();
        if (verifyData.success && verifyData.score < 0.5) {
          return corsResponse(400, { error: "Spam detected. Please try again." });
        }
      } catch (captchaErr) {
        console.warn("reCAPTCHA check skipped:", captchaErr.message);
      }
    }

    const leadId    = randomUUID();
    const createdAt = new Date().toISOString();

    const item = {
      leadId,
      createdAt,
      firstName,
      lastName,
      phone,
      email:            email || "",
      service,
      consultationDate: consultationDate || "",
      preferredTime:    preferredTime || "",
      description:      description || "",
      status:           "new",   // new | contacted | in-progress | completed
      internalNotes:    "",      // filled in via the phone app
    };

    // Save to DynamoDB
    await dynamo.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));

    // Send notification email via SES
    await ses.send(new SendEmailCommand({
      Source: FROM_EMAIL,
      Destination: { ToAddresses: [NOTIFY_EMAIL] },
      Message: {
        Subject: {
          Data: `New Lead: ${firstName} ${lastName} — ${service}`,
        },
        Body: {
          Html: {
            Data: `
              <h2 style="font-family:sans-serif;color:#1B6272;">New Estimate Request — JBD Improvements</h2>
              <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%;max-width:540px;">
                <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600;width:180px;">Name</td><td style="padding:8px 12px;">${firstName} ${lastName}</td></tr>
                <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600;">Phone</td><td style="padding:8px 12px;"><a href="tel:${phone}">${phone}</a></td></tr>
                <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600;">Email</td><td style="padding:8px 12px;">${email || "—"}</td></tr>
                <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600;">Service</td><td style="padding:8px 12px;">${service}</td></tr>
                <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600;">Consultation Date</td><td style="padding:8px 12px;">${consultationDate || "—"}</td></tr>
                <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600;">Preferred Time</td><td style="padding:8px 12px;">${preferredTime || "—"}</td></tr>
                <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600;">Description</td><td style="padding:8px 12px;">${description || "—"}</td></tr>
                <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600;">Lead ID</td><td style="padding:8px 12px;color:#999;">${leadId}</td></tr>
              </table>
            `,
          },
          Text: {
            Data: `New lead from ${firstName} ${lastName}\nPhone: ${phone}\nEmail: ${email || "—"}\nService: ${service}\nDate: ${consultationDate || "—"}\nTime: ${preferredTime || "—"}\nDescription: ${description || "—"}`,
          },
        },
      },
    }));

    return corsResponse(200, { success: true, leadId });

  } catch (err) {
    console.error(err);
    return corsResponse(500, { error: "Something went wrong. Please try again." });
  }
};

function corsResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}
