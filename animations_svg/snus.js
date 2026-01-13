document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  gsap.fromTo(
    "#flyImg",
    { x: "-150px", y: -220, rotation: 0 },
    {
      x: "200vw",
      y: 300,
      xPercent: -100,
      rotation: 520,
      duration: 10,
      ease: "expoScale",
      transformOrigin: "10% 65%",
      scrollTrigger: {
        trigger: ".container",
        start: "bottom top",
        // optional zum Testen:
        // markers: true
      }
    }
  );
});
