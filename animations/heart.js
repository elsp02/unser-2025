const gif = document.getElementById("myGif");
const heartText = document.getElementById("heart-text");

gif.addEventListener("click", () => {
  gif.src = gif.dataset.gif + "?t=" + Date.now();
    //heartText.textContent = "bald wieder ein:";
});