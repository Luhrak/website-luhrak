import { safeFetchText } from "./helper/safeFetchText.js";

class LiveSearch extends HTMLElement {
  constructor() {
    super();
    this.form = this.querySelector("form");
    this.timer = null;
    this.targetElement = null;
    this.submitButton = this.querySelector('button[role="submit"]');
  }

  static get observedAttributes() {
    return ["target"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "target") {
      this.targetElement = document.body.querySelector(newValue);
    }
  }

  connectedCallback() {
    this.addEventListener("input", this.inputHandler);
    this.addEventListener("change", this.inputHandler);
  }

  disconnectedCallback() {
    this.removeEventListener("input", this.inputHandler);
    this.removeEventListener("change", this.inputHandler);
  }

  inputHandler(e) {
    // Timer for preventing too many rapid api calls while typing
    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      if (!this.targetElement) return;
      this.updateResults(this.targetElement);
    }, 500);
  }

  async updateResults(targetElement) {
    const form = this.form;
    const formData = new FormData(form);
    const params = this.formDataToQueryString(formData);
    const url = form.action + "?" + params;
    this.setUpdateStauts(true);
    this.getFromUrl(url, (data) => {
      const dataDoc = new DOMParser().parseFromString(data.data, "text/html");
      this.targetElement.innerHTML = dataDoc.querySelector(
        this.getAttribute("target"),
      ).innerHTML;
      this.setUpdateStauts(false);
    });
  }

  setUpdateStauts(isUpdating) {
    this.submitButton.innerHTML = isUpdating
      ? '<span class="loader small"></span>'
      : "Submit";
  }

  formDataToQueryString(formData) {
    return formData
      .entries()
      .map(([k, v]) => `${k}=${v}`)
      .toArray()
      .join("&");
  }

  async getFromUrl(url, onData) {
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
}

// JS availablity check
if ("querySelector" in document && "addEventListener" in window) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () =>
      customElements.define("live-search", LiveSearch),
    );
  } else {
    customElements.define("live-search", LiveSearch);
  }
}
