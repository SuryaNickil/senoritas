/* ── INJECT NAV + FOOTER (MUST RUN FIRST — all selectors depend on injected elements) ── */
const NAV_HTML = `
<nav class="site-nav" id="siteNav">
  <a href="index.html" class="nav-logo">SENORITAS</a>
  <ul class="nav-links">
    <li><a href="index.html">Home</a></li>
    <li><a href="menu.html">Menu</a></li>
    <li><a href="about.html">About</a></li>
    <li><a href="gallery.html">Gallery</a></li>
    <li><a href="contact.html">Contact</a></li>
  </ul>
  <a href="https://www.toasttab.com/senoritas" target="_blank" class="nav-order">ORDER NOW</a>
  <div class="nav-hamburger" id="hamburger">
    <span></span><span></span><span></span>
  </div>
</nav>
<div class="nav-drawer" id="navDrawer">
  <a href="index.html">Home</a>
  <a href="menu.html">Menu</a>
  <a href="about.html">About</a>
  <a href="gallery.html">Gallery</a>
  <a href="contact.html">Contact</a>
  <a href="https://www.toasttab.com/senoritas" target="_blank" style="color:var(--orange)">Order Online →</a>
</div>`;

const FOOTER_HTML = `
<footer class="site-footer">
  <div>
    <div class="footer-logo">SENORITAS</div>
    <p style="font-size:11px;color:rgba(255,255,255,.3);letter-spacing:2px;margin-top:4px">BREAKFAST · LUNCH · DINNER</p>
    <p style="font-size:11px;color:rgba(255,255,255,.3);margin-top:4px"><!-- TODO: update hours --> Mon–Sun: 7:00 AM – 10:00 PM</p>
  </div>
  <nav class="footer-links">
    <a href="menu.html">Menu</a>
    <a href="about.html">About</a>
    <a href="gallery.html">Gallery</a>
    <a href="contact.html">Contact</a>
  </nav>
  <p class="footer-copy">© 2025 SENORITAS RESTAURANT · ALL RIGHTS RESERVED</p>
</footer>`;

document.getElementById('nav-placeholder')?.insertAdjacentHTML('afterend', NAV_HTML);
document.getElementById('footer-placeholder')?.insertAdjacentHTML('afterend', FOOTER_HTML);

/* ── NAV SCROLL BEHAVIOR ─────────────────── */
const nav = document.querySelector('.site-nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── MOBILE HAMBURGER ────────────────────── */
const hamburger = document.querySelector('.nav-hamburger');
const drawer = document.querySelector('.nav-drawer');
hamburger?.addEventListener('click', () => {
  drawer?.classList.toggle('open');
});

/* ── ACTIVE NAV LINK ─────────────────────── */
document.querySelectorAll('.nav-links a, .nav-drawer a').forEach(link => {
  if (link.href === location.href) link.classList.add('active');
});

/* ── SCROLL REVEAL ───────────────────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      if (e.target.dataset.stagger) {
        e.target.querySelectorAll('.reveal, .reveal-scale').forEach((child, i) => {
          child.style.transitionDelay = `${i * 80}ms`;
          child.classList.add('visible');
        });
      }
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .reveal-scale').forEach(el => observer.observe(el));
document.querySelectorAll('[data-stagger]').forEach(el => observer.observe(el));

/* ── MENU TABS ───────────────────────────── */
document.querySelectorAll('[data-tab-btn]').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tabBtn;
    document.querySelectorAll('[data-tab-btn]').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('[data-tab-panel]').forEach(p => p.classList.add('hidden'));
    btn.classList.add('active');
    document.querySelector(`[data-tab-panel="${target}"]`)?.classList.remove('hidden');
  });
});

/* ── LIGHTBOX ────────────────────────────── */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

document.querySelectorAll('.gallery-item').forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightbox?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  });
});

lightbox?.addEventListener('click', () => {
  lightbox.classList.add('hidden');
  document.body.style.overflow = '';
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    lightbox?.classList.add('hidden');
    document.body.style.overflow = '';
  }
});
