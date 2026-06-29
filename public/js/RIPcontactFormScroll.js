// We cant render "about" with form data and errors
// and also scroll to the id heading at the same time
// This script does exactly that

function flashTimeout() {
  return;
  if (hasErrors()) {
    const scrollTarget = document.querySelector("#contact-about");
    scrollTarget.scrollIntoView({ behavior: "instant", block: "start" });
  }
}

function hasErrors() {
  const errorsExist = document.querySelector(".form-error");
  return errorsExist ? true : false;
}

// JS availablity check
if ("querySelector" in document && "addEventListener" in window) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", flashTimeout);
  } else {
    flashTimeout();
  }
}
