"use strict";
import { safeFetchText } from "./helper/safeFetchText.js";

class GlanceView extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["select"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "select") {
      console.log(
        `The attribute 'select' changed from "${oldValue}" to "${newValue}"`,
      );
    }
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
    const glance = document.querySelector(".glanceView");
    const selector = this.getAttribute("select") ?? undefined;
    glance.classList.remove("invisible");
    glance.innerHTML = '<span class="loader"></span>';

    showGlanceView(url, glance, selector);
  }
}

async function showGlanceView(url, glance, selector = "article") {
  getFromUrl(url, (data) => {
    const dataDoc = new DOMParser().parseFromString(data.data, "text/html");
    const content = dataDoc.querySelector(selector);
    glance.innerHTML = "";
    glance.appendChild(content);
    insertCloseButton(content);
  });
}

async function insertCloseButton(content) {
  const headingDiv = content.querySelector(".headingWithButtons");
  console.log(content);
  console.log(headingDiv);
  const closeButton = document.createElement("button");
  closeButton.textContent = "X";
  closeButton.addEventListener("click", closeGlanceView);
  headingDiv.appendChild(closeButton);
}

function closeGlanceView() {
  const glance = document.querySelector(".glanceView");
  glance.classList.add("invisible");
}

async function getFromUrl(url, onData) {
  const { data, error } = await safeFetchText(url, {
    method: "GET",
    headers: {},
  });

  if (error) {
    console.error("safe fetch error:", error);
    return;
  }

  if (data) {
    await onData(data);
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
