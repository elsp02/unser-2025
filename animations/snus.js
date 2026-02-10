document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  gsap.fromTo(
    "#snus",
    { x: "-150vw", y: "20vh", rotation: 0, transformOrigin: "0% 0%" },
    {
      x: "200vw",
      y: "90vh",
      xPercent: -100,
      rotation: 820,
      duration: 10,
      ease: "none",
      scrollTrigger: {
        trigger: "#fourth-scroll-section",
        start: "top top",
        // optional zum Testen:
        markers: false,
      }
    }
  );
});

window.addEventListener("load", () => {
  if (window.ScrollTrigger) {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }
});