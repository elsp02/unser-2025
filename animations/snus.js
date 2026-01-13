// =====================================
// SNUS FLY-BY + WOBBLE
// =====================================

document.addEventListener("DOMContentLoaded", () => {

  gsap.registerPlugin(ScrollTrigger);

  const snus = document.querySelector("#snus");
  if (!snus) return;

  // -------------------------------
  // Startzustand
  // -------------------------------
  gsap.set(snus, {
    x: "-110vw",
    y: "-95vh",
    rotation: 0,
    opacity: 0,
    transformOrigin: "10% 15%"
  });

  // -------------------------------
  // Wobble (pausiert, läuft nur beim Flug)
  // -------------------------------
  const wobble = gsap.to(snus, {
    y: 6,
    duration: 0.35,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    paused: true
  });

  // -------------------------------
  // Flug-Timeline
  // -------------------------------
  const snusFly = gsap.timeline({
    paused: true,
    onStart: () => wobble.play(),
    onComplete: () => wobble.pause(0)
  });

  snusFly
    .set(snus, { opacity: 1 })
    .to(snus, {
      x: "110vw",
      y: 0,
      rotation: 520,
      duration: 15,
      ease: "power2.inOut"
    })
    .set(snus, { opacity: 0 });

  // -------------------------------
  // ScrollTrigger
  // -------------------------------
  ScrollTrigger.create({
    trigger: "#fourth-scroll-section",
    start: " top top",
    onEnter: () => snusFly.restart(true),
    onLeaveBack: () => {
      snusFly.pause(0);
    },
    markers: true,
  });

});
