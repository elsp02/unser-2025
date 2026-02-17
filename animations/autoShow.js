document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  //Lenis initialisieren + global verfügbar machen
  const lenis = (window.lenis ||= new Lenis({ smooth: true }));

  lenis.on("scroll", ScrollTrigger.update);


  if (!window.__lenisTickerBound) {
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    window.__lenisTickerBound = true;
  }

 // container mit class autoshow animieren
  const els = gsap.utils.toArray(".autoShow");
  gsap.set(els, { autoAlpha: 0, visibility: "hidden", y: 45 }); // subtiler als 35

  els.forEach((el) => {
    gsap.to(el, {
      autoAlpha: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
      overwrite: "auto",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        once: true, 
        //toggleActions: "play none none reset",
        markers: false,
      },
    });
  });

  // 3) Refresh nach Load (Images/Fonts)
  window.addEventListener("load", () => {
    ScrollTrigger.refresh(true);
  });

  // 4) Hook für Loader
  window.__AUTO_SHOW_REFRESH__ = () => ScrollTrigger.refresh(true);
});
