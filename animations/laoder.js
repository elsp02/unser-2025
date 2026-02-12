// ==============================
// GSAP GIF LOADER (min. 5s)
// ==============================
const MIN_LOADER_TIME = 5000; // ms

const loader = document.getElementById("loader");
const page = document.getElementById("main-container");
const loaderGif = document.getElementById("loader-gif");

const startTime = performance.now();

// Optional: Scroll sperren, solange Loader sichtbar ist
document.documentElement.style.overflow = "hidden";
document.body.style.overflow = "hidden";

// Optional: kleines Einblenden des GIFs
if (typeof gsap !== "undefined") {
  gsap.set(loader, { opacity: 1 });
  gsap.fromTo(loaderGif, { opacity: 0 }, { opacity: 1, duration: 1, ease: "power2.out" });
}

window.addEventListener("load", () => {
  const elapsed = performance.now() - startTime;
  const remaining = Math.max(0, MIN_LOADER_TIME - elapsed);

  setTimeout(() => {
    hideLoader();
  }, remaining);
});

function hideLoader() {
  // Scroll wieder erlauben
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";

  const tl = gsap.timeline({
    onComplete: () => {
      loader.remove();

      // 1) Lenis neu syncen (falls vorhanden)
      // (je nachdem, wie du Lenis initialisierst, heißt die Variable evtl. anders)
      if (window.lenis) {
        window.lenis.resize();
        window.lenis.scrollTo(window.lenis.scroll, { immediate: true }); // stabilisiert den State
      }

      // 2) GSAP/ScrollTrigger neu berechnen
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh(true);
      }

      // 3) Falls du meinen AutoShow-Refresh Hook nutzt
      if (window.__AUTO_SHOW_REFRESH__) {
        window.__AUTO_SHOW_REFRESH__();
      }
    }
  });

  tl.to(loader, {
    opacity: 0,
    duration: 0.6,
    ease: "power2.inOut"
  })
  .to(page, {
    opacity: 1,
    duration: 0.6,
    ease: "power2.out"
  }, "<");
}

