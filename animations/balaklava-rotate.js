// ---- STICKER SPIN (Click + Random) ----
document.addEventListener("DOMContentLoaded", () => {
  const elena = document.querySelector("#elena-balaklava");
  const lukas = document.querySelector("#lukas-balaklava");

  let headerVisible = false;

  function spinOnce(el) {
    // damit man nicht klicken kann während es sich gerade dreht
    if (!el) return;
    if (el.dataset.spinning === "1") return;
    el.dataset.spinning = "1";

    gsap.timeline({
      onComplete: () => (el.dataset.spinning = "0"),
    })
      .to(el, { scale: 1.06, duration: 0.08, ease: "power1.out" })
      .to(el, { rotation: "+=360", duration: 1.2, ease: "power2.inOut" }, 0)
      .to(el, { scale: 1.0, duration: 0.18, ease: "power1.out" }, 0.12);
  }

  // beim hovern
  elena?.addEventListener("pointerenter", () => spinOnce(elena));
  lukas?.addEventListener("pointerenter", () => spinOnce(lukas));

  // beim clicken
  elena?.addEventListener("pointerdown", () => spinOnce(elena));
  lukas?.addEventListener("pointerdown", () => spinOnce(lukas));

  // random irgendwann
  function randomSpin(el, min, max) {
    const delay = gsap.utils.random(min, max);

    setTimeout(() => {
      if (headerVisible) {
        spinOnce(el);
      }
      randomSpin(el, min, max); // startet sich selbst neu
    }, delay * 1000); //delay * 1000 = umrechnung in millisekunden 
  }

  // dafür da dass animation nur läuft wenn header im viewport ist
  ScrollTrigger.create({
    trigger: ".header-section",
    start: "top bottom",
    end: "bottom top",
    onEnter: () => headerVisible = true,
    onEnterBack: () => headerVisible = true,
    onLeave: () => headerVisible = false,
    onLeaveBack: () => headerVisible = false,
  });


  // löst erst aus, wenn loader oncomplete ist und verschwunden ist
  window.startStickerSpins = () => {
    // einmal kurz nach Loader-Ende, damit man es sicher sieht
    setTimeout(() => spinOnce(elena), 350);

    // danach wird setTimeout Funktion normal ausgeführt 
    setTimeout(() => randomSpin(elena, 9, 20), 2500);
    setTimeout(() => randomSpin(lukas, 6, 13), 2000);
  };
});
