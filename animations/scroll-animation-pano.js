document.addEventListener("DOMContentLoaded", ()=>{
            const lenis = new Lenis();
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
                        pin: section,
                        start: "center center",
                        end: () => `+=${-getScrollAmount()}`,
                        scrub: true, 
                        markers: true,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    }
                });
            }

            initHorizontalScroll();
        })

window.addEventListener("load", () => {
  if (window.ScrollTrigger) {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }
});