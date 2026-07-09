import { ifJsAvailableAndLoaded } from "./helper/ifJsAvailableAndLoaded.js";

ifJsAvailableAndLoaded(flashTimeout, ["querySelector", "addEventListener"]);

const flashTransformation = [
  // Start
  { transform: "translateX(-50%) translateY(0) scale(1,1)" },

  // Grow slightly for a bounce
  {
    transform: "translateX(-50%) translateY(0.3em) scale(1.06,1.06)",
    // go down instead of up for a moment
  },

  // Squish horizontally and move up
  {
    transform: "translateX(-50%) translateY(0) scale(0.92,1)",
  },
  {
    transform: "translateX(-50%) translateY(-3.2em) scale(0.60,0.80)",
  },
];

const flashTiming = {
  duration: 300,
  // easing: "ease-in-out",
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
