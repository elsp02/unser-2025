document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // 1) Lenis genau EINMAL initialisieren + global verfügbar machen
  const lenis = (window.lenis ||= new Lenis({ smooth: true }));

  lenis.on("scroll", ScrollTrigger.update);

  // Falls du irgendwo schon gsap.ticker.add für Lenis machst: NICHT doppelt machen.
  // Wir sichern das ab:
  if (!window.__lenisTickerBound) {
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    window.__lenisTickerBound = true;
  }

  // 2) Nur die Container animieren (stage + scroll), subtil, nur einmal
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
        markers: true,
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
