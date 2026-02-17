document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  gsap.to(".scroll-indicator", {
    autoAlpha:0,
    y: 30,              // optional: leicht nach oben bewegen
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".scroll-indicator",
      start: "bottom 90%",   // wenn obere Kante die Mitte erreicht
      //once: true, 
      toggleActions: "play none none reset",
    }
  });
});

window.addEventListener("load", () => {
  if (window.ScrollTrigger) {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }
});