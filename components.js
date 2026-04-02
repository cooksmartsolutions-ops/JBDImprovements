// Shared nav + footer + JS behaviors
// Call renderNav('pageName') and renderFooter() in each page

function renderNav(activePage) {
  const links = [
    { href: 'index.html',    label: 'Home',     key: 'home' },
    { href: 'services.html', label: 'Services', key: 'services' },
    { href: 'about.html',    label: 'About',    key: 'about' },
    { href: 'projects.html', label: 'Projects', key: 'projects' },
    { href: 'contact.html',  label: 'Contact',  key: 'contact' },
  ];

  const navLinks = links.map(l =>
    `<a href="${l.href}" class="nav-link${activePage === l.key ? ' active' : ''}">${l.label}</a>`
  ).join('');

  const mobileLinks = links.map(l =>
    `<a href="${l.href}" class="mobile-link${activePage === l.key ? ' active' : ''}">${l.label}</a>`
  ).join('');

  document.getElementById('nav-placeholder').innerHTML = `
    <nav id="navbar">
      <div class="nav-inner">
        <a href="index.html" class="nav-logo" aria-label="JBD Improvements Home">
          <img src="brand_assets/JBDLogo.webp" alt="JBD Improvements" />
        </a>
        <div class="nav-links">${navLinks}</div>
        <div class="nav-right">
          <div class="nav-social">
            <a href="https://www.facebook.com/profile.php?id=100068583097924" target="_blank" rel="noopener" class="nav-social-btn" aria-label="Facebook">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
            </a>
            <a href="https://www.instagram.com/jbd_improvements_/" target="_blank" rel="noopener" class="nav-social-btn" aria-label="Instagram">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
          </div>
          <a href="tel:+18173576614" class="nav-phone">(817) 357-6614</a>
          <a href="contact.html" class="btn-amber sm">Free Estimate</a>
        </div>
        <button id="menuBtn" aria-label="Toggle menu">
          <svg id="iconOpen" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <svg id="iconClose" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="display:none">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <div id="mobileMenu" class="mobile-menu">
        <div class="mobile-menu-inner">
          ${mobileLinks}
          <a href="tel:+18173576614" style="font-size:14px;font-weight:600;color:var(--dark);">(817) 357-6614</a>
          <a href="contact.html" class="btn-amber">Free Estimate</a>
        </div>
      </div>
    </nav>`;

  // Mobile menu toggle
  const btn = document.getElementById('menuBtn');
  const menu = document.getElementById('mobileMenu');
  const open = document.getElementById('iconOpen');
  const close = document.getElementById('iconClose');
  let isOpen = false;

  btn.addEventListener('click', () => {
    isOpen = !isOpen;
    menu.classList.toggle('open', isOpen);
    open.style.display = isOpen ? 'none' : 'block';
    close.style.display = isOpen ? 'block' : 'none';
  });
}

function renderFooter() {
  document.getElementById('footer-placeholder').innerHTML = `
    <footer>
      <div class="footer-inner">
        <div class="footer-grid">
          <div class="footer-col">
            <img src="brand_assets/JBDLogo.webp" alt="JBD Improvements" class="footer-logo" />
            <p class="footer-tagline">Transforming backyards into beautiful outdoor living spaces across the Dallas–Fort Worth area.</p>
            <div class="social-row">
              <a href="https://www.facebook.com/profile.php?id=100068583097924" target="_blank" rel="noopener" class="social-btn" aria-label="Facebook">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
              <a href="https://www.instagram.com/jbd_improvements_/" target="_blank" rel="noopener" class="social-btn" aria-label="Instagram">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
            </div>
          </div>
          <div class="footer-col">
            <h4>Services</h4>
            <div class="footer-links">
              <a href="services.html" class="footer-link">Patio Covers</a>
              <a href="services.html" class="footer-link">Covered Pergolas</a>
              <a href="services.html" class="footer-link">Outdoor Kitchens</a>
              <a href="services.html" class="footer-link">Outdoor Fireplaces</a>
              <a href="services.html" class="footer-link">Stamped Concrete</a>
              <a href="services.html" class="footer-link">Roofing</a>
            </div>
          </div>
          <div class="footer-col">
            <h4>Company</h4>
            <div class="footer-links">
              <a href="index.html" class="footer-link">Home</a>
              <a href="about.html" class="footer-link">About Us</a>
              <a href="projects.html" class="footer-link">Our Work</a>
              <a href="contact.html" class="footer-link">Free Estimate</a>
            </div>
          </div>
          <div class="footer-col">
            <h4>Contact</h4>
            <div class="footer-links">
              <a href="tel:+18173576614" class="footer-link">(817) 357-6614</a>
              <a href="mailto:123jbd@msn.com" class="footer-link">123jbd@msn.com</a>
              <span class="footer-link">Dallas–Fort Worth, TX</span>
            </div>
          </div>
        </div>
        <div class="footer-bar">
          <span>© 2026 JBD Improvements LLC. All rights reserved.</span>
          <span>DFW's Outdoor Living Specialists</span>
        </div>
      </div>
    </footer>`;
}

// Scroll progress bar (added to every page)
function initProgressBar() {
  const bar = document.createElement('div');
  bar.id = 'progress-bar';
  bar.style.cssText = 'position:fixed;top:0;left:0;z-index:200;height:3px;width:0%;background:linear-gradient(to right,#1B6272,#C47520);transition:width 0.1s linear;pointer-events:none;';
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
}

// Scroll reveal
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}
