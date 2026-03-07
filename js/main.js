/**
 * Las Caritas del Tuyú - Funcionalidad principal
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
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

  function showPage(index) {
    if (index < 0) index = totalPages - 1;
    if (index >= totalPages) index = 0;
    currentIndex = index;

    pages.forEach((page, i) => page.classList.toggle('active', i === currentIndex));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));

    if (counterEl) counterEl.textContent = currentIndex + 1;
  }

  prevBtn?.addEventListener('click', () => showPage(currentIndex - 1));
  nextBtn?.addEventListener('click', () => showPage(currentIndex + 1));

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.getAttribute('data-index'), 10);
      showPage(index);
    });
  });

  document.addEventListener('keydown', event => {
    const section = document.getElementById('diapositivas');
    const rect = section?.getBoundingClientRect();
    if (!rect || rect.top > window.innerHeight || rect.bottom < 0) return;
    if (event.key === 'ArrowLeft') {
      showPage(currentIndex - 1);
      event.preventDefault();
    }
    if (event.key === 'ArrowRight') {
      showPage(currentIndex + 1);
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
