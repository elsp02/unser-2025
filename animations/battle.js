window.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // Startzustand (sofort, vor Scroll)
  gsap.set(".team-left img",  { x: "-120vw", rotation: -6, scale: 0.98 });
  gsap.set(".team-right img", { x: "120vw",  rotation:  6, scale: 0.98 });
  gsap.set(".battle .vs", { opacity: 0, scale: 0.7 });


  const tl = gsap.timeline({
    defaults: { duration: 2, ease: "power3.out" },
    scrollTrigger: {
      trigger: "#kastenlauf",
      start: "top 40%",   // wenn stage oben am Viewport ist
      toggleActions: "play none none none",
      markers: true       // nur zum Debuggen
    }
  });
  
  // Logos rein
  tl.to(".team-left img", {
      x: 0,
      rotation: 0,
      scale: 1
    }, 0)

    .to(".team-right img", {
      x: 0,
      rotation: 0,
      scale: 1
    }, 0.08)

    // Impact
    .to([".team-left img", ".team-right img"], {
      duration: 0.12,
      scale: 1.03,
      ease: "power1.out"
    }, ">-0.1")

    .to([".team-left img", ".team-right img"], {
      duration: 0.18,
      scale: 1,
      ease: "power2.inOut"
    }, ">")

    // VS poppt rein
    .to(".battle .vs", {
      opacity: 1,
      scale: 1,
      duration: 0.35,
      ease: "back.out(2.4)"
    }, "<-0.05")
});


window.addEventListener("load", () => {
  if (window.ScrollTrigger) {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }
});