"use strict";
import { ifJsAvailableAndLoaded } from "./helper/ifJsAvailableAndLoaded.js";
import { safeFetchText } from "./helper/safeFetchText.js";

class ModalView extends HTMLElement {
  constructor() {
    super();
    this.hasMoreButton = null;
  }

  static get observedAttributes() {
    return ["select", "morebutton"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "select") {
      // console.log(
      //   `The attribute 'select' changed from "${oldValue}" to "${newValue}"`,
      // );
    }
    if (name === "morebutton") {
      this.hasMoreButton = newValue === "true";
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
    toggleScrollLock(true);
    modal.innerHTML =
      '<div class="loader-wrapper"><span class="loader"></span></div>';

    showModalView(url, modal, selector, this.hasMoreButton);
  }
}

ifJsAvailableAndLoaded(
  () => customElements.define("modal-view", ModalView),
  ["querySelector", "addEventListener", "customElements"],
);

async function showModalView(
  url,
  modal,
  selector = "article",
  hasMoreButton = false,
) {
  getFromUrl(url, (data) => {
    const dataDoc = new DOMParser().parseFromString(data.data, "text/html");
    const content = dataDoc.querySelector(selector);
    const headingDiv = content.querySelector(".headingWithButtons");
    const insertLocation = headingDiv.querySelector(".row") ?? headingDiv;

    modal.innerHTML = ""; // else its cloning content and the const is not live
    modal.appendChild(content);

    if (hasMoreButton) insertMoreButton(insertLocation, url);
    insertCloseButton(insertLocation);
    letBackgroundCloseModal(modal);
  });
}

async function insertMoreButton(insertLocation, url) {
  const moreButton = document.createElement("button");
  moreButton.textContent = "More";
  moreButton.addEventListener("click", () => {
    window.location.replace(url);
  });
  insertLocation.appendChild(moreButton);
}

async function insertCloseButton(insertLocation) {
  const closeButton = document.createElement("button");
  closeButton.textContent = "X";
  closeButton.addEventListener("click", closeModalView);
  insertLocation.appendChild(closeButton);
}

function closeModalView() {
  const modal = document.querySelector(".modal");
  modal.classList.add("invisible");
  toggleScrollLock(false);
}

function letBackgroundCloseModal(modal) {
  modal.addEventListener("click", (e) => {
    if (e.target !== modal) return;
    closeModalView();
  });
}

function toggleScrollLock(bool) {
  const body = document.body;
  bool ? (body.style.overflow = "hidden") : (body.style.overflow = "unset");
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
