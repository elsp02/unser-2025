window.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const svg  = document.querySelector("#Denk1Svg");
  const path = document.querySelector("#Denk1-path");
  const triggerContainer = document.querySelector("#denkblase-container");
  const img = document.querySelector("#denkblase-img");

  const bbox = path.getBBox();
  const padding = 0;

  const viewBox = `
    ${bbox.x - padding}
    ${bbox.y - padding}
    ${bbox.width + padding * 2}
    ${bbox.height + padding * 2}
  `.trim();

  svg.setAttribute("viewBox", viewBox);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

  const length = path.getTotalLength();

  gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
  gsap.set(img, { opacity: 0, scale: 0.95 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: triggerContainer,
      start: "top 50%",
      once: true,
      markers: true
    }
  });

  tl.to(path, {
    strokeDashoffset: 0,
    duration: 6,
    ease: "power3.inOut"
  }).to(img, {
    opacity: 1,
    scale: 1,
    duration: 0.6,
    ease: "power2.out"
  }, "+=0.1"); // kleine Pause nach dem Zeichnen
});