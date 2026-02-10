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
  gsap.fromTo(loaderGif, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" });
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

      // Falls ScrollTrigger verwendet wird: neu berechnen
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
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
  }, "<"); // gleichzeitig mit Loader-Fade
}
