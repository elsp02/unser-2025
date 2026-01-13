document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const battle = document.querySelector(".battle");
  const left   = document.querySelector(".team-left");
  const right  = document.querySelector(".team-right");
  const vs     = document.querySelector(".vs");

  if (!battle || !left || !right) return;

  gsap.set(vs, { opacity: 0, scale: 0.6 });

  const tl = gsap.timeline({
    paused: true,
    defaults: { duration: 0.9, ease: "power3.out" }
  });

  tl.fromTo(left,
      { x: "-120vw", rotation: -6, scale: 0.98 },
      { x: 0, rotation: 0, scale: 1 },
      0
    )
    .fromTo(right,
      { x: "120vw", rotation: 6, scale: 0.98 },
      { x: 0, rotation: 0, scale: 1 },
      0.08
    )
    .to([left, right], { duration: 0.12, scale: 1.04, ease: "power1.out" }, ">-0.1")
    .to([left, right], { duration: 0.18, scale: 1, ease: "power2.inOut" }, ">")
    .to(vs, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2.4)" }, "<-0.05")

    // Shake nur die BILDER, dann wackelt garantiert nicht der ganze Block:
    .to([".team-left img", ".team-right img"], { x: "+=6", duration: 0.05, ease: "none" }, ">-0.05")
    .to([".team-left img", ".team-right img"], { x: "-=12", duration: 0.05, ease: "none" })
    .to([".team-left img", ".team-right img"], { x: "+=6", duration: 0.05, ease: "none" });

  ScrollTrigger.create({
    trigger: battle,
    start: "top 70%",
    once: true,
    onEnter: () => tl.play(0),
    // markers: true
  });
});
