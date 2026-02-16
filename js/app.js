/* =====================================================
   NAV DROPDOWN (mobile click behavior)
===================================================== */

document.querySelectorAll(".nav-drop > a.pill").forEach((trigger) => {
  trigger.addEventListener("click", (e) => {
    const wrapper = trigger.parentElement;
    const menu = wrapper.querySelector(".drop-menu");
    if (!menu) return;

    // En desktop dejamos que hover maneje el menú
    if (window.matchMedia("(hover: hover)").matches) return;

    const isOpen = wrapper.classList.contains("open");

    // Cerrar todos antes de abrir uno nuevo
    document.querySelectorAll(".nav-drop").forEach((drop) => {
      drop.classList.remove("open");
      drop.querySelector("a.pill")?.setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      e.preventDefault(); // Primer tap: solo abre
      wrapper.classList.add("open");
      trigger.setAttribute("aria-expanded", "true");
    }
    // Segundo tap: navega normalmente
  });
});

// Cerrar menú si se hace click fuera
document.addEventListener("click", (e) => {
  if (!e.target.closest(".nav-drop")) {
    document.querySelectorAll(".nav-drop").forEach((drop) => {
      drop.classList.remove("open");
      drop.querySelector("a.pill")?.setAttribute("aria-expanded", "false");
    });
  }
});

/* =====================================================
   CAROUSEL (autoplay + arrows + dots)
===================================================== */

(() => {
  const carousel = document.querySelector("[data-carousel]");
  if (!carousel) return;

  const track = carousel.querySelector("[data-carousel-track]");
  const slides = Array.from(carousel.querySelectorAll("[data-carousel-slide]"));
  const dots = Array.from(carousel.querySelectorAll("[data-carousel-dot]"));

  const prevBtn =
    carousel.querySelector("[data-carousel-prev]") ||
    carousel.querySelector('[data-action="prev"]');

  const nextBtn =
    carousel.querySelector("[data-carousel-next]") ||
    carousel.querySelector('[data-action="next"]');

  if (!track || slides.length === 0) return;

  let current = slides.findIndex((slide) =>
    slide.classList.contains("is-active"),
  );
  if (current < 0) current = 0;

  let timer = null;
  const INTERVAL_MS = 6000;

  // Forzar comportamiento tipo slider
  track.style.display = "flex";
  track.style.willChange = "transform";
  track.style.transition = "transform 450ms ease";

  slides.forEach((slide) => {
    slide.style.minWidth = "100%";
    slide.style.flex = "0 0 100%";
  });

  function updateUI() {
    track.style.transform = `translateX(-${current * 100}%)`;

    slides.forEach((slide, i) =>
      slide.classList.toggle("is-active", i === current),
    );

    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === current));
  }

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    updateUI();
  }

  function next() {
    goTo(current + 1);
  }

  function prev() {
    goTo(current - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    timer = window.setInterval(next, INTERVAL_MS);
  }

  function stopAutoplay() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  // Flechas
  prevBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    prev();
    startAutoplay();
  });

  nextBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    next();
    startAutoplay();
  });

  // Dots
  dots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      e.preventDefault();
      const index = Number(dot.dataset.carouselDot);
      if (!Number.isNaN(index)) {
        goTo(index);
        startAutoplay();
      }
    });
  });

  // Pausar al interactuar
  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);
  carousel.addEventListener("focusin", stopAutoplay);
  carousel.addEventListener("focusout", startAutoplay);

  // Init
  updateUI();
  startAutoplay();
})();
