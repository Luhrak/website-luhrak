export function ifJsAvailableAndLoaded(execute, reqFeatures) {
  // Checks if all required featuers are available
  if (reqFeatures.length > 0) {
    for (const feature of reqFeatures) {
      if (!(feature in document || feature in window)) return;
    }
  }
  // Then executes the desired function once DOM is loaded
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", execute)
    : execute();
}
