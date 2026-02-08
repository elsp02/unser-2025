window.addEventListener("DOMContentLoaded", () => {

  gsap.registerPlugin(ScrollTrigger);

  const svg  = document.querySelector("#heartSvg");
  const path = document.querySelector("#heartPath");
  const triggerContainer = document.querySelector(".stage-container");

  //  viewBox auf  Path zuschneiden
  const bbox = path.getBBox();
  const padding = Math.max(bbox.width, bbox.height) * 0.08;

  const viewBox = `
    ${bbox.x - padding}
    ${bbox.y - padding}
    ${bbox.width + padding * 2}
    ${bbox.height + padding * 2}
  `.trim();

  svg.setAttribute("viewBox", viewBox);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

  //  Linienlänge ermitteln
  const length = path.getTotalLength();

  // Startzustand: Linie unsichtbar
  gsap.set(path, {
    strokeDasharray: length,
    strokeDashoffset: length
  });

  // zeichnen trigger durch scrollen
  gsap.to(path, {
    strokeDashoffset: 0,
    duration: 3,
    ease: "power2.inOut",
    scrollTrigger: {
      trigger: triggerContainer,
      start: "top 20%",   //sobald stage-container oben am Viewport ist
      once: true,         // nur einmal abspielen
        markers: true     
    }
  });

});

window.addEventListener("load", () => {
  if (window.ScrollTrigger) {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }
});