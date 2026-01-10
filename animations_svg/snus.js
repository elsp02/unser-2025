
gsap.fromTo(
  "#flyImg",
  { x: "-150px", rotation: 0 },
  {
    x: "200vw",
    xPercent: -100,
    rotation: 520,
    duration: 3,
    ease: "none",
    transformOrigin: "50% 65%"
    /*scrollTrigger: {
      trigger: "#snusContainer",*/
  }
);

  // Wabbeln (kleine vertikale Bewegung)
  gsap.to("#flyImg", {
    y: 6,                 // Stärke des Wabbelns
    duration: 0.35,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
  });