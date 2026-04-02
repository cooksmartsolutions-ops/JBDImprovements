// ── Shared animations for all inner pages ──

function initPageAnimations() {

  // ── CURSOR GLOW ──
  const glow = document.createElement('div');
  glow.style.cssText = 'position:fixed;pointer-events:none;z-index:9999;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(27,98,114,0.07) 0%,transparent 70%);transform:translate(-50%,-50%);transition:opacity 0.3s ease;opacity:0;top:0;left:0;';
  document.body.appendChild(glow);
  let glowVisible = false;
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
    if (!glowVisible) { glow.style.opacity = '1'; glowVisible = true; }
  });
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; glowVisible = false; });

  // ── 3D CARD TILT ──
  document.querySelectorAll('.svc-card').forEach(card => {
    card.style.transformStyle = 'preserve-3d';
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`;
      card.style.boxShadow = '0 12px 40px rgba(0,0,0,0.12), 0 4px 16px rgba(27,98,114,0.1)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)';
      card.style.boxShadow = '';
    });
  });

  // ── WHY/VALUE CARD TILT ──
  document.querySelectorAll('.why-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ── PAGE HERO WORD REVEAL ──
  // Animate the page-hero h1 words in on load
  const heroH1 = document.querySelector('.page-hero-h1');
  if (heroH1) {
    const text = heroH1.textContent.trim();
    heroH1.style.opacity = '1';
    heroH1.innerHTML = text.split(' ').map((word, i) =>
      `<span style="display:inline-block;opacity:0;transform:translateY(28px);transition:opacity 0.6s cubic-bezier(0.25,1,0.5,1) ${0.1 + i * 0.1}s,transform 0.6s cubic-bezier(0.25,1,0.5,1) ${0.1 + i * 0.1}s">${word}&nbsp;</span>`
    ).join('');
    window.addEventListener('load', () => {
      heroH1.querySelectorAll('span').forEach(s => {
        s.style.opacity = '1';
        s.style.transform = 'translateY(0)';
      });
      const sub = document.querySelector('.page-hero-sub');
      if (sub) {
        sub.style.opacity = '0';
        sub.style.transform = 'translateY(16px)';
        sub.style.transition = 'opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s';
        setTimeout(() => { sub.style.opacity = '1'; sub.style.transform = 'translateY(0)'; }, 100);
      }
    });
  }

  // ── GALLERY ITEM STAGGER ──
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length) {
    const gObs = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'scale(1)';
          }, (parseInt(entry.target.dataset.idx) || 0) * 60);
          gObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    galleryItems.forEach((el, i) => {
      el.dataset.idx = i;
      el.style.opacity = '0';
      el.style.transform = 'scale(0.95)';
      el.style.transition = `opacity 0.5s ease, transform 0.5s cubic-bezier(0.25,1,0.5,1)`;
      gObs.observe(el);
    });
  }

  // ── COUNTER ANIMATION (for about/stats pages) ──
  document.querySelectorAll('.stat-num[data-count]').forEach(el => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const start = performance.now();
        function update(now) {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.floor(eased * target) + suffix;
          if (p < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });
    obs.observe(el);
  });
}
