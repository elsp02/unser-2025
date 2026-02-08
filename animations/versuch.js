console.clear();
const horizontalElements = gsap.utils.toArray(".horizontal-wrapper");
const panelsArray = [];
horizontalElements.forEach((el, i) => {
  const container = el.querySelector(".horizontal-container");
  const panels = gsap.utils.toArray(".panel", container);
  panelsArray.push(panels.length);
  gsap.to(container, {
    xPercent: -(100 * (panels.length - 1)),
    ease: "none",
    scrollTrigger: {
      trigger: container,
      start: (s) => {
        if (i) {
          return (
            "center+=" + window.innerHeight * i * panelsArray[i - 1] + " center"
          );
        } else {
          return "center center";
        }
      },
      end: "+=" + 100 * panels.length + "%",
      pin: "#mainContainer",
      scrub: true,
      markers: {
        indent: 150 * i,
        startColor: "white",
        endColor: "white"
      },
      id: i + 1
    }
  });
});