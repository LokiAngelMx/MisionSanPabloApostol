// ==============================
// NAV DROPDOWN (mobile click)
// ==============================
document.querySelectorAll(".nav-drop > a.pill").forEach((trigger) => {
  trigger.addEventListener("click", (e) => {
    const wrap = trigger.parentElement;
    const menu = wrap.querySelector(".drop-menu");
    if (!menu) return;

    // En desktop se usa hover; no bloqueamos la navegación
    if (window.matchMedia("(hover: hover)").matches) return;

    // Primer tap abre el menú, segundo tap navega
    if (!wrap.classList.contains("open")) {
      e.preventDefault();

      document.querySelectorAll(".nav-drop").forEach((d) => {
        d.classList.remove("open");
        d.querySelector("a.pill")?.setAttribute("aria-expanded", "false");
      });

      wrap.classList.add("open");
      trigger.setAttribute("aria-expanded", "true");
    } else {
      wrap.classList.remove("open");
      trigger.setAttribute("aria-expanded", "false");
      // No prevenimos default aquí → navega al href
    }
  });
});

// Cerrar al tocar fuera
document.addEventListener("click", (e) => {
  if (!e.target.closest(".nav-drop")) {
    document.querySelectorAll(".nav-drop").forEach((d) => {
      d.classList.remove("open");
      d.querySelector("a.pill")?.setAttribute("aria-expanded", "false");
    });
  }
});

// ==============================
// CAROUSEL (autoplay + arrows + dots) - TRACK SLIDER
// ==============================
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

  let current = slides.findIndex((s) => s.classList.contains("is-active"));
  if (current < 0) current = 0;

  let timer = null;
  const INTERVAL_MS = 6000;

  // Asegura layout tipo slider (por si tu CSS no lo tiene)
  track.style.display = "flex";
  track.style.willChange = "transform";
  track.style.transition = "transform 450ms ease";
  slides.forEach((s) => {
    s.style.minWidth = "100%";
    s.style.flex = "0 0 100%";
  });

  function paint() {
    // Mover track
    track.style.transform = `translateX(-${current * 100}%)`;

    // Clases (por si también quieres estilos con is-active)
    slides.forEach((s, i) => s.classList.toggle("is-active", i === current));
    dots.forEach((d, i) => d.classList.toggle("is-active", i === current));
  }

  function setActive(index) {
    current = (index + slides.length) % slides.length;
    paint();
  }

  function next() {
    setActive(current + 1);
  }

  function prev() {
    setActive(current - 1);
  }

  function start() {
    stop();
    timer = window.setInterval(next, INTERVAL_MS);
  }

  function stop() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }

  // Flechas
  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.preventDefault();
      prev();
      start();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      next();
      start();
    });
  }

  // Dots
  dots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      e.preventDefault();
      const idx = Number(dot.getAttribute("data-carousel-dot"));
      if (!Number.isNaN(idx)) {
        setActive(idx);
        start();
      }
    });
  });

  // Pausa al hover / focus
  carousel.addEventListener("mouseenter", stop);
  carousel.addEventListener("mouseleave", start);
  carousel.addEventListener("focusin", stop);
  carousel.addEventListener("focusout", start);

  // Init
  paint();
  start();
})();
