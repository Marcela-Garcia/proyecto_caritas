/**
 * Las Caritas del Tuyú - Funcionalidad principal
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initNavbarScroll();
  initScrollReveal();
  initCounters();
  initBookViewer();
  initGallery();
  initNumberedGallery();
});

// ========== Navegación y menú lateral ==========
function initNavbar() {
  const toggle = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.nav-drawer');
  const backdrop = document.querySelector('.nav-drawer-backdrop');
  const closeBtn = document.querySelector('.nav-drawer-close');
  const drawerLinks = document.querySelectorAll('.nav-drawer a');

  if (!toggle || !drawer || !backdrop) return;

  function setDrawerState(isOpen) {
    drawer.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    drawer.setAttribute('aria-hidden', String(!isOpen));
    document.body.classList.toggle('menu-open', isOpen);
    backdrop.hidden = !isOpen;
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    setDrawerState(!isOpen);
  });

  closeBtn?.addEventListener('click', () => setDrawerState(false));
  backdrop.addEventListener('click', () => setDrawerState(false));

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => setDrawerState(false));
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setDrawerState(false);
    }
  });
}

// ========== Navbar al hacer scroll ==========
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const updateNavbar = () => {
    navbar.classList.toggle('navbar--scrolled', window.scrollY > 48);
  };

  updateNavbar();
  window.addEventListener('scroll', updateNavbar, { passive: true });
}

// ========== Animaciones al entrar en pantalla ==========
function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const revealSelectors = [
    '.section-title',
    '.section-intro',
    '.quienes-panel',
    '.quienes-header',
    '.contacto-panel',
    '.contacto-header',
    '.multimedia-youtube',
    '.multimedia-carousel-panel',
    '.donar-panel',
    '.obra-cita',
    '.obra-card',
    '.ayuda-card',
    '.book-viewer',
    '.book-indicators',
    '.contacto-item',
    '.contacto-redes',
    '.gallery-back-wrap',
    '.stat-item'
  ];

  const elements = document.querySelectorAll(revealSelectors.join(', '));
  if (!elements.length) return;

  elements.forEach((element, index) => {
    element.classList.add('reveal');
    element.style.setProperty('--reveal-delay', `${(index % 4) * 0.08}s`);
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(element => observer.observe(element));
}

// ========== Contadores animados (barra de impacto) ==========
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    if (prefersReduced || Number.isNaN(target)) {
      el.textContent = target;
      return;
    }

    const duration = 1800;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => observer.observe(counter));
}

// ========== Visor de diapositivas tipo libro ==========
function initBookViewer() {
  const pages = document.querySelectorAll('.book-page');
  const prevBtn = document.querySelector('.book-prev');
  const nextBtn = document.querySelector('.book-next');
  const counterEl = document.getElementById('current-page');
  const dotsContainer = document.querySelector('.book-dots');

  let currentIndex = 0;
  const totalPages = pages.length;

  if (dotsContainer) {
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('span');
      dot.className = 'book-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('data-index', i);
      dot.setAttribute('aria-label', `Ir a diapositiva ${i + 1}`);
      dotsContainer.appendChild(dot);
    }
  }

  const dots = document.querySelectorAll('.book-dot');

  function showPage(index, direction = 0) {
    if (index < 0) index = totalPages - 1;
    if (index >= totalPages) index = 0;

    const previousIndex = currentIndex;
    currentIndex = index;

    pages.forEach((page, i) => {
      const isActive = i === currentIndex;
      page.classList.toggle('active', isActive);

      if (isActive) {
        page.classList.remove('slide-prev', 'slide-next');
        if (direction !== 0) {
          page.classList.add(direction > 0 ? 'slide-next' : 'slide-prev');
        }
      }
    });

    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));

    if (counterEl) counterEl.textContent = currentIndex + 1;

    if (direction === 0 && previousIndex !== currentIndex) {
      const inferredDirection = currentIndex > previousIndex ? 1 : -1;
      const activePage = pages[currentIndex];
      activePage?.classList.add(inferredDirection > 0 ? 'slide-next' : 'slide-prev');
    }
  }

  prevBtn?.addEventListener('click', () => showPage(currentIndex - 1, -1));
  nextBtn?.addEventListener('click', () => showPage(currentIndex + 1, 1));

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.getAttribute('data-index'), 10);
      const direction = index > currentIndex ? 1 : index < currentIndex ? -1 : 0;
      showPage(index, direction);
    });
  });

  document.addEventListener('keydown', event => {
    const section = document.getElementById('diapositivas');
    const rect = section?.getBoundingClientRect();
    if (!rect || rect.top > window.innerHeight || rect.bottom < 0) return;
    if (event.key === 'ArrowLeft') {
      showPage(currentIndex - 1, -1);
      event.preventDefault();
    }
    if (event.key === 'ArrowRight') {
      showPage(currentIndex + 1, 1);
      event.preventDefault();
    }
  });
}

// ========== Galería carrusel (duplicar para loop infinito) ==========
function initGallery() {
  const track = document.querySelector('.gallery-track');
  if (!track) return;

  const slides = track.innerHTML;
  track.innerHTML = slides + slides;
}

// ========== Galería numerada ==========
function initNumberedGallery() {
  const gallery = document.getElementById('numbered-gallery');
  const count = document.getElementById('gallery-count');
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImage = document.getElementById('gallery-lightbox-image');
  const lightboxCaption = document.getElementById('gallery-lightbox-caption');
  const lightboxClose = document.querySelector('.gallery-lightbox-close');

  if (!gallery || !count) return;

  const prefix = gallery.dataset.prefix || 'galeria';
  const total = Number.parseInt(gallery.dataset.total || '0', 10);
  const extension = gallery.dataset.extension || 'jpeg';

  renderNumberedGallery(gallery, count, prefix, total, extension);

  if (!lightbox || !lightboxImage || !lightboxCaption) return;

  gallery.addEventListener('click', event => {
    const card = event.target.closest('.gallery-card');
    if (!card) return;

    lightboxImage.src = card.dataset.image || '';
    lightboxImage.alt = card.dataset.caption || 'Imagen de la galería';
    lightboxCaption.textContent = card.dataset.caption || 'Galería de imágenes';
    lightbox.hidden = false;
    document.body.classList.add('menu-open');
  });

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImage.src = '';
    document.body.classList.remove('menu-open');
  }

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !lightbox.hidden) {
      closeLightbox();
    }
  });
}

function renderNumberedGallery(gallery, count, prefix, total, extension) {
  if (!total) {
    count.hidden = true;
    gallery.innerHTML = '<div class="gallery-empty">No encontramos fotos para mostrar en este momento.</div>';
    return;
  }

  count.hidden = true;
  gallery.innerHTML = Array.from({ length: total }, (_, index) => {
    const imageNumber = index + 1;
    if (imageNumber === 5) {
      return '';
    }

    const imagePath = `imagenes/${prefix}${imageNumber}.${extension}`;
    const caption = `Galería ${imageNumber}`;

    return `
      <button class="gallery-card" type="button" data-image="${imagePath}" data-caption="${caption}">
        <img src="${imagePath}" alt="${caption}" loading="lazy">
      </button>
    `;
  }).join('');

  const cards = [...gallery.querySelectorAll('.gallery-card')];

  cards.forEach(card => {
    const image = card.querySelector('img');
    image?.addEventListener('error', () => {
      card.remove();
      updateGalleryCount(gallery, count);
    }, { once: true });
  });

  updateGalleryCount(gallery, count);
  initGalleryCardReveal(gallery);
}

function initGalleryCardReveal(gallery) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = gallery.querySelectorAll('.gallery-card');
  if (!cards.length) return;

  cards.forEach((card, index) => {
    card.classList.add('reveal');
    card.style.setProperty('--reveal-delay', `${(index % 6) * 0.06}s`);
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
  );

  cards.forEach(card => observer.observe(card));
}

function updateGalleryCount(gallery, count) {
  const visibleCards = gallery.querySelectorAll('.gallery-card').length;

  if (!visibleCards) {
    count.hidden = true;
    gallery.innerHTML = '<div class="gallery-empty">No encontramos fotos para mostrar en este momento.</div>';
    return;
  }

  count.hidden = true;
}
