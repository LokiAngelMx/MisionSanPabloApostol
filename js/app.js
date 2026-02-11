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
