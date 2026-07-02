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

function activeNav() {
  setTimeout(removeFlash, delayMs);
}

function removeFlash() {
  const flashbox = document.querySelector(".flashbox");
  if (!flashbox) return;
  flashbox
    .animate(transformation, timing)
    .finished.then(() => flashbox.remove())
    .catch(() => flashbox.remove());
}

// JS availablity check
if ("querySelector" in document && "addEventListener" in window) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", activeNav);
  } else {
    activeNav();
  }
}
