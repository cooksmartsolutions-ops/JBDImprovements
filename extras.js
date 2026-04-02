// ═══════════════════════════════════════════════════
//  JBD IMPROVEMENTS — EXTRA FEATURES
//  1. Lightbox gallery
//  2. Before/After slider
//  3. Testimonials carousel
//  4. Mobile sticky call button
//  5. Typewriter effect
//  6. Back-to-top button
//  7. Service area map
// ═══════════════════════════════════════════════════

// ─────────────────────────────────────────
// 1. LIGHTBOX
// ─────────────────────────────────────────
function initLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;

  // Build lightbox DOM
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.innerHTML = `
    <div id="lb-backdrop"></div>
    <div id="lb-box">
      <button id="lb-close" aria-label="Close">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
      <button id="lb-prev" aria-label="Previous">
        <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <button id="lb-next" aria-label="Next">
        <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
      </button>
      <div id="lb-img-wrap">
        <img id="lb-img" src="" alt="" />
      </div>
      <div id="lb-caption"></div>
      <div id="lb-counter"></div>
    </div>`;
  document.body.appendChild(lb);

  const style = document.createElement('style');
  style.textContent = `
    #lightbox { position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center; }
    #lightbox.open { display:flex; }
    #lb-backdrop { position:absolute;inset:0;background:rgba(9,22,29,0.95);cursor:pointer; }
    #lb-box { position:relative;z-index:1;max-width:90vw;max-height:90vh;display:flex;flex-direction:column;align-items:center; }
    #lb-img-wrap { position:relative;max-width:90vw;max-height:78vh;overflow:hidden;border-radius:10px; }
    #lb-img { max-width:90vw;max-height:78vh;object-fit:contain;display:block;border-radius:10px;
      transition:opacity 0.25s ease,transform 0.25s ease; }
    #lb-img.switching { opacity:0;transform:scale(0.97); }
    #lb-caption { margin-top:14px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.6);
      letter-spacing:0.08em;text-transform:uppercase; }
    #lb-counter { font-size:11px;color:rgba(255,255,255,0.35);margin-top:4px; }
    #lb-close { position:fixed;top:20px;right:24px;background:rgba(255,255,255,0.1);border:none;
      color:#fff;width:40px;height:40px;border-radius:50%;cursor:pointer;display:flex;
      align-items:center;justify-content:center;transition:background 0.2s; }
    #lb-close:hover { background:rgba(255,255,255,0.2); }
    #lb-prev,#lb-next { position:fixed;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.08);
      border:1px solid rgba(255,255,255,0.15);color:#fff;width:48px;height:48px;border-radius:50%;
      cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.2s; }
    #lb-prev:hover,#lb-next:hover { background:rgba(255,255,255,0.18); }
    #lb-prev { left:20px; }
    #lb-next { right:20px; }
    @media(max-width:640px){ #lb-prev{left:8px;}#lb-next{right:8px;} }
  `;
  document.head.appendChild(style);

  const imgs = Array.from(items).map(el => ({
    src: el.querySelector('img').src,
    label: el.querySelector('.gallery-item-label')?.textContent || ''
  }));
  let current = 0;

  function open(i) {
    current = i;
    show();
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }
  function show() {
    const img = document.getElementById('lb-img');
    img.classList.add('switching');
    setTimeout(() => {
      img.src = imgs[current].src;
      img.alt = imgs[current].label;
      document.getElementById('lb-caption').textContent = imgs[current].label;
      document.getElementById('lb-counter').textContent = `${current + 1} / ${imgs.length}`;
      img.classList.remove('switching');
    }, 200);
  }
  function prev() { current = (current - 1 + imgs.length) % imgs.length; show(); }
  function next() { current = (current + 1) % imgs.length; show(); }

  items.forEach((el, i) => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => open(i));
  });
  document.getElementById('lb-close').addEventListener('click', close);
  document.getElementById('lb-backdrop').addEventListener('click', close);
  document.getElementById('lb-prev').addEventListener('click', prev);
  document.getElementById('lb-next').addEventListener('click', next);
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });
}

// ─────────────────────────────────────────
// 2. BEFORE / AFTER SLIDER
// ─────────────────────────────────────────
function initBeforeAfter() {
  const containers = document.querySelectorAll('.before-after');
  if (!containers.length) return;

  const style = document.createElement('style');
  style.textContent = `
    .before-after { position:relative;overflow:hidden;border-radius:14px;cursor:ew-resize;user-select:none; }
    .before-after img { width:100%;height:100%;object-fit:cover;display:block; }
    .ba-before { position:absolute;inset:0;overflow:hidden; }
    .ba-before img { position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover; }
    .ba-handle { position:absolute;top:0;bottom:0;width:3px;background:#fff;
      box-shadow:0 0 12px rgba(0,0,0,0.5);cursor:ew-resize;transform:translateX(-50%); }
    .ba-handle-btn { position:absolute;top:50%;transform:translateY(-50%) translateX(-50%);
      width:44px;height:44px;border-radius:50%;background:#fff;
      box-shadow:0 2px 16px rgba(0,0,0,0.35);
      display:flex;align-items:center;justify-content:center;gap:4px; }
    .ba-label { position:absolute;top:14px;font-size:10px;font-weight:700;
      letter-spacing:0.1em;text-transform:uppercase;padding:5px 12px;
      border-radius:100px;color:#fff; }
    .ba-label-before { left:14px;background:rgba(27,98,114,0.75);backdrop-filter:blur(4px); }
    .ba-label-after  { right:14px;background:rgba(196,117,32,0.75);backdrop-filter:blur(4px); }
  `;
  document.head.appendChild(style);

  containers.forEach(container => {
    const afterImg = container.querySelector('img.ba-after');
    const beforeImg = container.querySelector('img.ba-before-img');
    if (!afterImg || !beforeImg) return;

    // Restructure DOM
    const afterSrc = afterImg.src; const beforeSrc = beforeImg.src;
    container.innerHTML = `
      <img src="${afterSrc}" alt="After" style="width:100%;height:100%;object-fit:cover;display:block;" />
      <div class="ba-before" style="width:50%">
        <img src="${beforeSrc}" alt="Before" />
      </div>
      <div class="ba-handle" style="left:50%">
        <div class="ba-handle-btn">
          <svg width="14" height="14" fill="none" stroke="#1B6272" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
          <svg width="14" height="14" fill="none" stroke="#1B6272" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
        </div>
      </div>
      <span class="ba-label ba-label-before">Before</span>
      <span class="ba-label ba-label-after">After</span>`;

    const beforeDiv = container.querySelector('.ba-before');
    const handle = container.querySelector('.ba-handle');
    let dragging = false;

    function setPos(x) {
      const rect = container.getBoundingClientRect();
      const pct = Math.min(Math.max((x - rect.left) / rect.width, 0.02), 0.98);
      beforeDiv.style.width = (pct * 100) + '%';
      handle.style.left = (pct * 100) + '%';
    }

    container.addEventListener('mousedown', e => { dragging = true; setPos(e.clientX); });
    window.addEventListener('mousemove', e => { if (dragging) setPos(e.clientX); });
    window.addEventListener('mouseup', () => dragging = false);
    container.addEventListener('touchstart', e => { dragging = true; setPos(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchmove', e => { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchend', () => dragging = false);
  });
}

// ─────────────────────────────────────────
// 3. TESTIMONIALS CAROUSEL
// ─────────────────────────────────────────
function initTestimonials() {
  const el = document.getElementById('testimonials-carousel');
  if (!el) return;

  const style = document.createElement('style');
  style.textContent = `
    .testimonials-section { padding:88px 0;background:var(--surface); }
    .testimonial-track { display:flex;transition:transform 0.5s cubic-bezier(0.25,1,0.5,1); }
    .testimonial-card {
      min-width:100%;padding:0 16px;box-sizing:border-box;
    }
    .testimonial-inner {
      background:var(--bg);border:1px solid var(--border);border-radius:16px;
      padding:36px 40px;position:relative;
      box-shadow:0 2px 12px rgba(27,98,114,0.06);
    }
    .testimonial-stars { display:flex;gap:4px;margin-bottom:18px; }
    .testimonial-stars svg { color:#C47520; }
    .testimonial-quote {
      font-size:17px;font-weight:300;color:var(--text);line-height:1.8;
      margin-bottom:24px;font-style:italic;
    }
    .testimonial-quote::before { content:'"';font-size:48px;color:var(--teal);line-height:0;
      vertical-align:-18px;margin-right:4px;font-style:normal; }
    .testimonial-author { display:flex;align-items:center;gap:14px; }
    .testimonial-author img { flex-shrink:0; }
    .testimonial-name { font-size:15px;font-weight:600;color:var(--dark); }
    .testimonial-loc { font-size:12px;color:var(--muted);margin-top:2px; }
    .testimonial-dots { display:flex;justify-content:center;gap:8px;margin-top:28px; }
    .testimonial-dot {
      width:8px;height:8px;border-radius:50%;background:var(--border);
      border:none;cursor:pointer;padding:0;
      transition:background 0.2s,transform 0.2s;
    }
    .testimonial-dot.active { background:var(--teal);transform:scale(1.3); }
    .testimonial-dot:focus-visible { outline:2px solid var(--teal);outline-offset:3px; }
    .testimonial-nav { display:flex;justify-content:center;gap:10px;margin-top:16px; }
    .testimonial-nav-btn {
      width:40px;height:40px;border-radius:50%;border:1.5px solid var(--border);
      background:var(--surface);color:var(--muted);cursor:pointer;
      display:flex;align-items:center;justify-content:center;
      transition:border-color 0.2s,color 0.2s,background 0.2s;
    }
    .testimonial-nav-btn:hover { border-color:var(--teal);color:var(--teal);background:var(--teal-pale); }
  `;
  document.head.appendChild(style);

  const reviews = [
    { name: 'Ashley Jay', loc: 'DFW, TX', text: 'Great to work with and his team did an incredible job!', avatar: 'Reviews/AshleyJay.jpg', verified: true },
    { name: 'Kathleen Russell', loc: 'DFW, TX', text: 'Wonderful job on our pergola! Courteous, professional and fair pricing. Thanks for a great job on our project!', avatar: 'Reviews/KathleenRussell.jpg', verified: true },
    { name: 'Michael R.', loc: 'Fort Worth, TX', text: 'JBD built us a complete outdoor kitchen and patio cover. The craftsmanship is incredible — everything is solid and exactly what we envisioned. Highly recommend!', avatar: 'https://i.pravatar.cc/80?img=11' },
    { name: 'James W.', loc: 'Keller, TX', text: 'They handled our roof insurance claim from start to finish. We barely had to lift a finger and ended up with a brand new roof. Couldn\'t be happier.', avatar: 'https://i.pravatar.cc/80?img=53' },
    { name: 'Carlos M.', loc: 'Grapevine, TX', text: 'The stamped concrete they laid in our backyard looks absolutely stunning. Great price, great work, done ahead of schedule. Will definitely use them again.', avatar: 'https://i.pravatar.cc/80?img=68' },
  ];

  el.innerHTML = `
    <div class="testimonials-section">
      <div class="container">
        <div class="reveal" style="text-align:center;margin-bottom:48px;">
          <span class="teal-rule" style="margin:0 auto 16px;"></span>
          <span class="section-label" style="display:block;text-align:center;">What Clients Say</span>
          <h2 class="section-title" style="text-align:center;">Customer Reviews</h2>
        </div>
        <div style="max-width:720px;margin:0 auto;overflow:hidden;">
          <div class="testimonial-track" id="ttrack">
            ${reviews.map(r => `
              <div class="testimonial-card">
                <div class="testimonial-inner">
                  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
                    <div class="testimonial-stars">
                      ${Array(5).fill('<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>').join('')}
                    </div>
                    ${r.verified ? `<span style="display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#1877F2;background:#EEF3FF;border:1px solid #C5D5F5;padding:4px 10px;border-radius:100px;">
                      <svg width="11" height="11" fill="#1877F2" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                      Facebook Review</span>` : ''}
                  </div>
                  <p class="testimonial-quote">${r.text}</p>
                  <div class="testimonial-author">
                    <img src="${r.avatar}" alt="${r.name}" style="width:46px;height:46px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid var(--border);" />
                    <div>
                      <div class="testimonial-name">${r.name}</div>
                      <div class="testimonial-loc">${r.loc}</div>
                    </div>
                  </div>
                </div>
              </div>`).join('')}
          </div>
          <div class="testimonial-dots">
            ${reviews.map((_, i) => `<button class="testimonial-dot${i===0?' active':''}" data-i="${i}" aria-label="Review ${i+1}"></button>`).join('')}
          </div>
          <div class="testimonial-nav">
            <button class="testimonial-nav-btn" id="tprev" aria-label="Previous">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button class="testimonial-nav-btn" id="tnext" aria-label="Next">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>`;

  const track = document.getElementById('ttrack');
  const dots = document.querySelectorAll('.testimonial-dot');
  let cur = 0, timer;

  function goTo(i) {
    cur = (i + reviews.length) % reviews.length;
    track.style.transform = `translateX(-${cur * 100}%)`;
    dots.forEach((d, j) => d.classList.toggle('active', j === cur));
  }
  function autoplay() { timer = setInterval(() => goTo(cur + 1), 5000); }
  function stopAuto() { clearInterval(timer); }

  document.getElementById('tprev').addEventListener('click', () => { stopAuto(); goTo(cur - 1); autoplay(); });
  document.getElementById('tnext').addEventListener('click', () => { stopAuto(); goTo(cur + 1); autoplay(); });
  dots.forEach(d => d.addEventListener('click', () => { stopAuto(); goTo(parseInt(d.dataset.i)); autoplay(); }));
  autoplay();
}

// ─────────────────────────────────────────
// 4. MOBILE STICKY CALL BUTTON
// ─────────────────────────────────────────
function initMobileCallBtn() {
  const style = document.createElement('style');
  style.textContent = `
    #mobile-call-btn {
      display:none;
      position:fixed;bottom:24px;right:20px;z-index:500;
      background:var(--amber);color:#fff;border:none;border-radius:100px;
      padding:14px 22px;font-family:'Inter',sans-serif;
      font-size:13px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
      text-decoration:none;align-items:center;gap:10px;
      box-shadow:0 4px 20px rgba(196,117,32,0.45),0 2px 8px rgba(0,0,0,0.15);
      cursor:pointer;
    }
    #mobile-call-btn::before {
      content:'';position:absolute;inset:-4px;border-radius:100px;
      border:2px solid rgba(196,117,32,0.4);
      animation:call-ring 2s ease-in-out infinite;
    }
    @keyframes call-ring {
      0%,100%{transform:scale(1);opacity:0.8}
      50%{transform:scale(1.06);opacity:0}
    }
    #mobile-call-btn:active { transform:scale(0.97); }
    @media(max-width:768px){
      #mobile-call-btn { display:flex; }
    }
  `;
  document.head.appendChild(style);

  const btn = document.createElement('a');
  btn.id = 'mobile-call-btn';
  btn.href = 'tel:+18173576614';
  btn.setAttribute('aria-label', 'Call JBD Improvements');
  btn.innerHTML = `
    <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
    </svg>
    Call Now`;
  document.body.appendChild(btn);
}

// ─────────────────────────────────────────
// 5. TYPEWRITER EFFECT
// ─────────────────────────────────────────
function initTypewriter() {
  const els = document.querySelectorAll('[data-typewriter]');
  els.forEach(el => {
    const phrases = el.dataset.typewriter.split('|');
    let pIdx = 0, cIdx = 0, deleting = false;
    el.innerHTML = '<span class="tw-text"></span><span class="tw-cursor">|</span>';
    const twText = el.querySelector('.tw-text');

    const cursorStyle = document.createElement('style');
    cursorStyle.textContent = `.tw-cursor{animation:blink 0.8s step-end infinite;color:var(--teal);font-weight:300;}@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`;
    document.head.appendChild(cursorStyle);

    function tick() {
      const phrase = phrases[pIdx];
      if (!deleting) {
        twText.textContent = phrase.slice(0, ++cIdx);
        if (cIdx === phrase.length) { deleting = true; setTimeout(tick, 2000); return; }
        setTimeout(tick, 65);
      } else {
        twText.textContent = phrase.slice(0, --cIdx);
        if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; setTimeout(tick, 400); return; }
        setTimeout(tick, 35);
      }
    }
    setTimeout(tick, 800);
  });
}

// ─────────────────────────────────────────
// 6. BACK TO TOP BUTTON
// ─────────────────────────────────────────
function initBackToTop() {
  const style = document.createElement('style');
  style.textContent = `
    #back-to-top {
      position:fixed;bottom:24px;left:20px;z-index:500;
      width:44px;height:44px;border-radius:50%;
      background:var(--surface);border:1.5px solid var(--border);
      color:var(--muted);cursor:pointer;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 12px rgba(0,0,0,0.1);
      opacity:0;transform:translateY(12px);pointer-events:none;
      transition:opacity 0.3s ease,transform 0.3s ease,border-color 0.2s,color 0.2s;
    }
    #back-to-top.visible { opacity:1;transform:translateY(0);pointer-events:all; }
    #back-to-top:hover { border-color:var(--teal);color:var(--teal); }
    #back-to-top:focus-visible { outline:2px solid var(--teal);outline-offset:3px; }
    @media(max-width:768px){ #back-to-top { left:auto;right:20px;bottom:80px; } }
  `;
  document.head.appendChild(style);

  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>`;
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ─────────────────────────────────────────
// 7. SERVICE AREA MAP
// ─────────────────────────────────────────
function initServiceAreaMap() {
  const el = document.getElementById('service-area-map');
  if (!el) return;

  const style = document.createElement('style');
  style.textContent = `
    .map-section { padding:88px 0;background:var(--bg); }
    .map-wrap {
      border-radius:16px;overflow:hidden;
      box-shadow:var(--shadow-md);border:1px solid var(--border);
      position:relative;
    }
    .map-wrap iframe { display:block;width:100%;height:420px;border:none;filter:saturate(0.85); }
    .map-overlay-badge {
      position:absolute;top:20px;left:20px;
      background:var(--surface);border:1px solid var(--border);border-radius:10px;
      padding:14px 18px;box-shadow:var(--shadow-sm);
      border-left:3px solid var(--teal);
    }
    .map-overlay-badge h4 { font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:800;
      text-transform:uppercase;color:var(--dark);margin-bottom:4px; }
    .map-overlay-badge p { font-size:12px;color:var(--muted);margin:0; }
  `;
  document.head.appendChild(style);

  el.innerHTML = `
    <div class="map-section">
      <div class="container">
        <div class="reveal" style="margin-bottom:40px;">
          <span class="teal-rule"></span>
          <span class="section-label">Coverage</span>
          <h2 class="section-title">Service Area</h2>
          <p class="section-sub">We serve the entire Dallas–Fort Worth metroplex and surrounding communities.</p>
        </div>
        <div class="map-wrap reveal">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d429710.3!2d-97.4856!3d32.7767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864e99375a2a1d67%3A0x3c8d2c2b4e0e2b9!2sDallas-Fort%20Worth%20Metroplex%2C%20TX!5e0!3m2!1sen!2sus!4v1700000000000"
            allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
            title="JBD Improvements service area — DFW Texas">
          </iframe>
          <div class="map-overlay-badge">
            <h4>DFW &amp; Surrounding Areas</h4>
            <p>Dallas · Fort Worth · Arlington · Keller<br>Southlake · Grapevine · Mansfield &amp; more</p>
          </div>
        </div>
      </div>
    </div>`;
}

// ─────────────────────────────────────────
// INIT ALL
// ─────────────────────────────────────────
function initExtras() {
  initLightbox();
  initBeforeAfter();
  initTestimonials();
  initMobileCallBtn();
  initTypewriter();
  initBackToTop();
  initServiceAreaMap();
}
