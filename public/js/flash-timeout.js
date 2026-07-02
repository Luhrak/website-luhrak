const flashTransformation = [
  { transform: "translateX(-50%) translateY(0)" },
  { transform: "translateX(-50%) translateY(-3em)" },
];

const flashTiming = {
  duration: 300,
  easing: "ease-in",
  fill: "forwards",
};

function flashTimeout() {
  const delayMs = 3000;
  setTimeout(removeFlash, delayMs);
}

function removeFlash() {
  const flashbox = document.querySelector(".flashbox");
  if (!flashbox) return;
  flashbox
    .animate(flashTransformation, flashTiming)
    .finished.then(() => flashbox.remove())
    .catch(() => flashbox.remove());
}

// JS availablity check
if ("querySelector" in document && "addEventListener" in window) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", flashTimeout);
  } else {
    flashTimeout();
  }
}
