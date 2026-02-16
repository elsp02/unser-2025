function updateScrollCentering() {
  document.querySelectorAll(".scroll-container").forEach((el) => {
    // wenn scrollwidth größer als clientwidth (also bilder) dann gibt es overflow -> man kann scrollen
    const hasOverflow = el.scrollWidth > el.clientWidth + 1;

    //ergebnis: true: inhalt breiter als container, false: inhalt schmäler 
    //wenn !hasOverflow (also false), dann soll in css is-centered wirken
    el.classList.toggle("is-centered", !hasOverflow);
    el.classList.toggle("", hasOverflow);

    // optional: wenn zentriert, sicher auf Anfang
    if (!hasOverflow) el.scrollLeft = 0;
  });
}

window.addEventListener("load", updateScrollCentering);
window.addEventListener("resize", updateScrollCentering);

// falls Bilder nachladen und erst dann Breiten stimmen:
document.querySelectorAll(".scroll-container img").forEach((img) => {
  img.addEventListener("load", updateScrollCentering, { once: true });
});
