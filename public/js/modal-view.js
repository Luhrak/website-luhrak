"use strict";
import { ifJsAvailableAndLoaded } from "./helper/ifJsAvailableAndLoaded.js";
import { safeFetchText } from "./helper/safeFetchText.js";

class ModalView extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["select"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "select") {
      // console.log(
      //   `The attribute 'select' changed from "${oldValue}" to "${newValue}"`,
      // );
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
    const modal = document.querySelector(".modal");
    const selector = this.getAttribute("select") ?? undefined;
    modal.classList.remove("invisible");
    modal.innerHTML =
      '<div class="loader-wrapper"><span class="loader"></span></div>';

    showModalView(url, modal, selector);
  }
}

ifJsAvailableAndLoaded(
  () => customElements.define("modal-view", ModalView),
  ["querySelector", "addEventListener", "customElements"],
);

async function showModalView(url, modal, selector = "article") {
  getFromUrl(url, (data) => {
    const dataDoc = new DOMParser().parseFromString(data.data, "text/html");
    const content = dataDoc.querySelector(selector);
    modal.innerHTML = "";
    modal.appendChild(content);
    insertCloseButton(content);
  });
}

async function insertCloseButton(content) {
  const headingDiv = content.querySelector(".headingWithButtons");
  const closeButton = document.createElement("button");
  closeButton.textContent = "X";
  closeButton.addEventListener("click", closeModalView);
  headingDiv.appendChild(closeButton);
}

function closeModalView() {
  const modal = document.querySelector(".modal");
  modal.classList.add("invisible");
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
