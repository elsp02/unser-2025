window.addEventListener("DOMContentLoaded", () => {

  const svg  = document.querySelector("#heartSvg");
  const path = document.querySelector("#heartPath");

  if (!svg || !path) {
    console.error("SVG oder Path nicht gefunden");
    return;
  }

  // 🔹 1) viewBox automatisch auf den Path zuschneiden
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

  // 🔹 2) Linienlänge ermitteln
  const length = path.getTotalLength();

  // 🔹 3) Startzustand: Linie unsichtbar
  gsap.set(path, {
    strokeDasharray: length,
    strokeDashoffset: length
  });

  // 🔹 4) Zeichnen
  gsap.to(path, {
    strokeDashoffset: 0,
    duration: 3,
    ease: "power2.inOut",
  });

});
