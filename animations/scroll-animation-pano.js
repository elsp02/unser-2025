document.addEventListener("DOMContentLoaded", ()=>{
            const lenis = (window.lenis ||= new Lenis({ smooth: true }));
            //const lenis = new Lenis();
            lenis.on("scroll", ScrollTrigger.update);
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);

            const scrollContainer = document.querySelector("#pano-track");
            const section = document.querySelector('#pano-container');
            const progressAmount = document.querySelector('.progress-amount');
            

            function initHorizontalScroll() {
                
                function getScrollAmount() {
                    const scrollWidth = scrollContainer.scrollWidth;
                    const windowWidth = window.innerWidth;
                    
                    return -(scrollWidth - windowWidth);
                }

                gsap.to(scrollContainer, {
                    x: getScrollAmount,
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        pin:"#main-container",
                        pinSpacing: true,
                        start: "center center",
                        end: () => `+=${-getScrollAmount()}`,
                        scrub: true, 
                        markers: false,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    }
                });
            }
            function fitWarteText() {
            const card = document.querySelector("#pano-bild");
            const p = document.querySelector("#slider-text");
            const img = card?.querySelector("img");
            if (!card || !p) return;

            // Zielbreite: lieber die Bildbreite nehmen, sonst Cardbreite
            // zuerst p auf Bildbreite setzen (einmalig / jedes mal ok)
            if (img) p.style.width = img.getBoundingClientRect().width + "px";
            const targetWidth = p.clientWidth;
            // Mess-Element (unsichtbar) mit exakt denselben Font-Styles wie dein p
            let measurer = document.querySelector("#warte-measurer");
            if (!measurer) {
                measurer = document.createElement("span");
                measurer.id = "warte-measurer";
                measurer.style.position = "absolute";
                measurer.style.visibility = "hidden";
                measurer.style.whiteSpace = "pre";
                measurer.style.left = "-9999px";
                measurer.style.top = "0";
                document.body.appendChild(measurer);
            }

            // Styles vom <p> übernehmen (Font/Size/Letterspacing etc.)
            const cs = getComputedStyle(p);
            measurer.style.fontFamily = cs.fontFamily;
            measurer.style.fontSize = cs.fontSize;
            measurer.style.fontWeight = cs.fontWeight;
            measurer.style.letterSpacing = cs.letterSpacing;
            measurer.style.textTransform = cs.textTransform;

            const prefix = "warte";
            const suffix = " tada";

            // Basisbreite messen
            measurer.textContent = prefix + suffix;
            const baseWidth = measurer.getBoundingClientRect().width;
            

            // Breite eines "e" messen
            measurer.textContent = "e";
            const eWidth = measurer.getBoundingClientRect().width || 1;

            // Wie viel Platz bleibt übrig?
            const remaining = Math.max(0, targetWidth - baseWidth);

            // Anzahl e berechnen (kleiner Sicherheitsabzug, damit es nicht wrappt)
            const safety = 5; // Pixel
            const countE = Math.max(0, Math.floor((remaining - safety) / eWidth));

            p.textContent = prefix + "e".repeat(countE) + suffix;
            }

            // Fonts & Bild laden beeinflussen die Messung -> nach load + nach resize
            window.addEventListener("load", () => {
            fitWarteText();
            });

            // wenn Fonts erst später ready sind
            if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(fitWarteText);
            }

            // responsive
            window.addEventListener("resize", () => {
            fitWarteText();
            });

            // optional: wenn dein Bild lazy lädt / später Größe bekommt
            const img = document.querySelector("#pano-bild img");
            if (img && !img.complete) {
            img.addEventListener("load", fitWarteText);
            }

            initHorizontalScroll();
        });

window.addEventListener("load", () => {
  if (window.ScrollTrigger) {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }
});