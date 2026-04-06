// ================= CONTENT DATABASE =================
const THOUGHTS = [
  { text: "Speed is a byproduct of clarity. Most projects stall because the direction is muddy.", date: "Mar 14, 2026" },
  { text: "If you can't explain it simply, you're building for yourself, not for others.", date: "Mar 08, 2026" },
  { text: "Legacy isn't what you leave behind. It's what you build that keeps building after you.", date: "Feb 22, 2026" }
];

const ARTICLES = [
  { id: "building-to-last", title: "On Building Things That Last", date: "Mar 12, 2026", excerpt: "Why I stopped chasing trends and started building for decades. The economics of patience.", link: "#" },
  { id: "architecture-attention", title: "The Architecture of Attention", date: "Feb 28, 2026", excerpt: "How environment shapes focus, and why deep work requires deliberate system design.", link: "#" },
  { id: "tested-principles", title: "Tested Principles", date: "Jan 15, 2026", excerpt: "Clear writing, honest work, and systems that outlive their creators. A manifesto.", link: "#" }
];

const WORKS = [
  { id: 1, title: "E-Commerce Platform Redesign", category: "Web Development", thumb: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80", desc: "Full-stack rebuild focusing on conversion optimization and mobile-first performance.", link: "#" },
  { id: 2, title: "Brand Identity & Motion System", category: "Design", thumb: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80", desc: "Complete visual identity with scalable design tokens and animated components.", link: "#" },
  { id: 3, title: "SaaS Analytics Dashboard", category: "UI/UX Engineering", thumb: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80", desc: "Real-time data visualization interface built for enterprise clients.", link: "#" }
];

// ================= DOM ELEMENTS =================
const thoughtsGrid = document.getElementById('thoughts-grid');
const articlesList = document.getElementById('articles-list');
const worksGrid = document.getElementById('works-grid');
const portfolioFeed = document.getElementById('portfolio-feed');
const portfolioLoading = document.getElementById('portfolio-loading');
const giftBtn = document.getElementById('gift-btn');
const giftMessage = document.getElementById('gift-message');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const bgLayer = document.querySelector('.bg-layer');

// ================= RENDER SECTIONS =================
if (thoughtsGrid) {
  thoughtsGrid.innerHTML = THOUGHTS.map(t => `
    <div class="thought-card reveal">
      <p class="thought-text">"${t.text}"</p>
      <span class="thought-date">${t.date}</span>
    </div>
  `).join('');
}

if (articlesList) {
  articlesList.innerHTML = ARTICLES.map(a => `
    <article class="article-item reveal">
      <div class="article-meta"><span>${a.date}</span></div>
      <h3 class="article-title">${a.title}</h3>
      <p class="article-excerpt">${a.excerpt}</p>
      <a href="${a.link}" class="article-link">Read Article →</a>
    </article>
  `).join('');
}

if (worksGrid) {
  worksGrid.innerHTML = WORKS.map(w => `
    <article class="work-item reveal">
      <div class="work-visual"><img src="${w.thumb}" alt="${w.title}"></div>
      <div class="work-info">
        <span style="font-size: 0.85rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.04em;">${w.category}</span>
        <h3>${w.title}</h3>
        <p>${w.desc}</p>
        <a href="${w.link}" class="work-link">View Project →</a>
      </div>
    </article>
  `).join('');
}

// ================= PORTFOLIO LOADER =================
if (portfolioFeed) {
  fetch('https://res.cloudinary.com/drigva9i0/raw/upload/portfolio-projects.json')
    .then(res => res.json())
    .then(projects => {
      portfolioLoading.style.display = 'none';
      portfolioFeed.innerHTML = projects.map((p, index) => `
        <article class="portfolio-item reveal" style="animation-delay: ${index * 0.1}s">
          <div class="portfolio-video">
            <video src="${p.videoUrl}" poster="${p.thumbnailUrl || ''}" controls playsinline preload="metadata"></video>
          </div>
          <div class="article-meta"><span>${p.category}</span><span>•</span><span>${p.date}</span></div>
          <h2 class="portfolio-title">${p.title}</h2>
          <p class="portfolio-desc">${p.description}</p>
          ${p.link ? `<a href="${p.link}" class="btn btn-ghost" style="padding: 0.7rem 1.5rem; font-size: 0.85rem;">Live Project →</a>` : ''}
        </article>
      `).join('');
    })
    .catch(err => {
      console.error('Error loading portfolio:', err);
      portfolioLoading.textContent = 'Failed to load projects. Check console.';
    });
}

// ================= GIFT PANEL =================
if (giftBtn && giftMessage) {
  giftBtn.addEventListener('click', () => {
    giftMessage.classList.toggle('active');
    giftBtn.textContent = giftMessage.classList.contains('active') ? 'Close Gift Panel' : 'Open Gift Panel';
  });
}

// ================= MOBILE MENU =================
if (mobileMenuToggle && mobileNav) {
  mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  });
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuToggle.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ================= SHOOTING STARS =================
function createShootingStar() {
  const star = document.createElement('div');
  star.classList.add('shooting-star');
  const startX = Math.random() * window.innerWidth;
  const startY = Math.random() * (window.innerHeight * 0.5);
  star.style.left = `${startX}px`;
  star.style.top = `${startY}px`;
  if(bgLayer) bgLayer.appendChild(star);
  setTimeout(() => { star.remove(); }, 1200);
}
setInterval(createShootingStar, 3500);

// ================= SCROLL REVEAL =================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal, .reveal-delay, .reveal-delay-2').forEach(el => observer.observe(el));

// ================= SMOOTH SCROLL =================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });
});