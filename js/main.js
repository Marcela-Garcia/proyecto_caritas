/**
 * Las Caritas del Tuyú - Funcionalidad principal
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initBookViewer();
  initGallery();
});

// ========== Navegación móvil ==========
function initNavbar() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');

  toggle?.addEventListener('click', () => {
    const isOpen = menu?.classList.toggle('active');
    toggle?.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Cerrar menú al hacer clic en un enlace
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      menu?.classList.remove('active');
      toggle?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
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

  // Crear indicadores de puntos
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

  // Navegación con teclado (solo cuando la sección de diapositivas es visible)
  document.addEventListener('keydown', (e) => {
    const section = document.getElementById('diapositivas');
    const rect = section?.getBoundingClientRect();
    if (!rect || rect.top > window.innerHeight || rect.bottom < 0) return;
    if (e.key === 'ArrowLeft') { showPage(currentIndex - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { showPage(currentIndex + 1); e.preventDefault(); }
  });
}

// ========== Galería carrusel (duplicar para loop infinito) ==========
function initGallery() {
  const track = document.querySelector('.gallery-track');
  if (!track) return;

  // Duplicar slides para efecto infinito
  const slides = track.innerHTML;
  track.innerHTML = slides + slides;
}
