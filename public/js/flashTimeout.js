const delayMs = 3000;

const transformation = [
  { transform: "translateX(-50%) translateY(0)" },
  { transform: "translateX(-50%) translateY(-3em)" },
];

const timing = {
  duration: 300,
  easing: "ease-in",
  fill: "forwards",
};

function flashTimeout() {
  console.log("timer beginn");
  setTimeout(removeFlash, delayMs);
}

function removeFlash() {
  const flashbox = document.querySelector(".flashbox");
  flashbox
    .animate(transformation, timing)
    .finished.then(() => flashbox.remove());
  //   flashbox.remove();
  console.log("removed");
}

// JS availablity check
if ("querySelector" in document && "addEventListener" in window) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", flashTimeout);
  } else {
    flashTimeout();
  }
}
