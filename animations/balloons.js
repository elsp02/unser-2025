document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector("#downloadBtn, .download-button");
  const layer = document.querySelector("#balloon-layer");
  if (!btn || !layer) return;

  // deine Line-Drawings (WebP/PNG mit transparentem Hintergrund ist ideal)
  const balloonImgs = [
    "images/sex1.webp",
  ];

  function spawnBalloons(amount = 10) {
    const w = window.innerWidth;

    for (let i = 0; i < amount; i++) {
      const img = document.createElement("img");
      img.className = "balloon";
      img.src = balloonImgs[i % balloonImgs.length];
      layer.appendChild(img);

      // random start
      const startX = Math.random() * w;
      const drift = (Math.random() - 0.5) * 260;           // seitliches driften
      const rise = window.innerHeight + 300;               // wie weit nach oben
      const dur = 4 + Math.random() * 1.8;               // 2.4–4.2s
      const delay = Math.random() * 0.35;                  // leicht gestaffelt
      const rot = (Math.random() - 0.5) * 30;              // -15..15°
      const scale = 0.7 + Math.random() * 0.55;

      // set initial
      gsap.set(img, {
        x: startX,
        y: 0,
        rotation: rot,
        scale,
        opacity: 0,
      });

      // zeit pro balloon
      const tl = gsap.timeline({
        delay,
        onComplete: () => img.remove(),
      });

      //sichtbar machen
      tl.to(img, {
        opacity: 1,
        duration: 0.2,
        ease: "sine.out",
      });

      //flugbewegung
      tl.to(img, {
        y: -rise,
        x: startX + drift,
        rotation: rot + (Math.random() - 0.5) * 50,
        duration: dur,
        ease: "sine.out",
      }, 0);

      // wobble
      tl.to(img, {
        x: `+=${(Math.random() - 0.5) * 60}`,
        rotation: `+=${(Math.random() - 0.5) * 18}`,
        duration: 0.9 + Math.random() * 0.6,
        ease: "sine.inOut",
        repeat: Math.ceil(dur / 1.2),
        yoyo: true,
      }, 0.1);

      // am ende ausfaden
      tl.to(img, {
        opacity: 0,
        duration: 0.35,
        ease: "power1.in",
      }, dur - 0.35);
    }
  }

  btn.addEventListener("click", () => {
    // Animation starten
    spawnBalloons(12);


  });
});
