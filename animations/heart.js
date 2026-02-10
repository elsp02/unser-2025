const gif = document.getElementById("myGif");
const heartText = document.getElementById("click");

gif.addEventListener("click", () => {
  gif.src = gif.dataset.gif + "?t=" + Date.now();
  heartText.style.display = "none";
    //heartText.textContent = "bald wieder ein:";
});