window.addEventListener("DOMContentLoaded", () => {
  const tl = gsap.timeline({ defaults: { duration: 0.9, ease: "power3.out" } });

  // Startzustand
  gsap.set(".left .logo",  { x: "-120vw", rotation: -6, scale: 0.98 });
  gsap.set(".right .logo", { x: "120vw",  rotation:  6, scale: 0.98 });

  tl.to(".left .logo", {
      x: 0,
      rotation: 0,
      scale: 1
    }, 0)
    .to(".right .logo", {
      x: 0,
      rotation: 0,
      scale: 1
    }, 0.08)

    // kleiner "Impact" sobald beide sitzen
    .to([".left .logo", ".right .logo"], {
      duration: 0.12,
      scale: 1.03,
      ease: "power1.out"
    }, ">-0.1")
    .to([".left .logo", ".right .logo"], {
      duration: 0.18,
      scale: 1,
      ease: "power2.inOut"
    }, ">")

    // VS poppt rein
    .to(".vs", {
      opacity: 1,
      scale: 1,
      duration: 0.35,
      ease: "back.out(2.4)"
    }, "<-0.05");
});

tl.to(".stage", { x: -6, duration: 0.05, ease: "none" }, ">-0.05")
  .to(".stage", { x:  6, duration: 0.05, ease: "none" })
  .to(".stage", { x:  0, duration: 0.05, ease: "none" });
