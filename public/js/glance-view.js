"use strict";
import { safeFetchText } from "./helper/safeFetchText.js";

class GlanceView extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.addEventListener("click", this.clickHandler);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.clickHandler);
  }

  clickHandler(e) {
    e.preventDefault();
    const url = this.querySelector("a").href;
    showGlanceView(url);
  }
}

async function showGlanceView(url) {
  const { data, error } = await safeFetchText(url, {
    method: "GET",
    headers: {},
  });

  if (error) {
    console.error("safe fetch error:", error);
    return;
  }

  if (data) {
    const dataDoc = new DOMParser().parseFromString(data.data, "text/html");
    const section = dataDoc.querySelector("section");
    console.log(section);

    const glance = document.querySelector(".glanceView");
    glance.classList.toggle("invisible");
  }
}

// JS availablity check
if (
  "customElements" in window &&
  "querySelector" in document &&
  "addEventListener" in window
) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () =>
      customElements.define("glance-view", GlanceView),
    );
  } else {
    customElements.define("glance-view", GlanceView);
  }
}
