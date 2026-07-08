import { safeFetchText } from "./helper/safeFetchText.js";

class FetchForm extends HTMLElement {
  constructor() {
    super();
    this.form = this.querySelector("form");
    this.timer = null;
    // https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal#examples
    this.form.abortController = null;
    this.isSubmitting = false;
  }

  async updateSubmitButton() {
    const form = this.form;
    this.updateFromForm((data) => {
      const submitButtons = form.querySelectorAll("button");
      const hasErrors = !isFormSubmittable(data.data);
      if (hasErrors) {
        for (const button of submitButtons) {
          button.classList.add("button-unclickable");
          button.disabled = true;
        }
      } else {
        for (const button of submitButtons) {
          button.classList.remove("button-unclickable");
          button.disabled = false;
        }
      }
    });
  }

  connectedCallback() {
    this.updateSubmitButton();
    this.form.addEventListener("submit", this.submitHandler);
    this.addEventListener("focusout", this.focusoutHandler);
    this.addEventListener("input", this.inputHandler);
  }

  disconnectedCallback() {
    this.form.removeEventListener("submit", this.submitHandler);
    this.removeEventListener("focusout", this.focusoutHandler);
    this.removeEventListener("input", this.inputHandler);
  }

  focusoutHandler(e) {
    const form = this.form;
    const formBlockActive = e.target.closest(".input-block");
    if (!form || !formBlockActive) return;
    this.updateError(formBlockActive);
  }

  inputHandler(e) {
    // Timer for preventing too many rapid api calls while typing
    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      const formBlockActive = e.target.closest(".input-block");
      if (!formBlockActive) return;
      resetError(formBlockActive);
      this.updateSubmitButton();
    }, 500);
  }

  submitHandler(e) {
    this.isSubmitting = true;
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  async updateError(formBlockActive) {
    this.updateFromForm((data) => {
      const formError = getFormBlockError(formBlockActive, data.data);
      if (!formError) return;
      insertFormErrors(formBlockActive, formError);
    });
  }

  async updateFromForm(onData) {
    const form = this.form;
    const formData = new FormData(form);
    formData.append("partial", true);
    this.form.abortController = new AbortController();
    const signal = this.form.abortController.signal;

    if (this.isSubmitting) return;

    const { data, error } = await safeFetchText(form.action, {
      method: "POST",
      headers: {},
      body: formData,
      signal,
    });

    if (error) {
      console.error("safe fetch error:", error);
      return;
    }

    if (data) {
      onData(data);
    }
  }
}

function getFormBlockError(formBlockActive, data) {
  const dataDoc = new DOMParser().parseFromString(data, "text/html");
  const formBlocks = dataDoc.querySelectorAll(".input-block");

  for (const block of formBlocks) {
    if (doFormBlocksMatch(formBlockActive, block))
      return block.querySelector(".form-error");
  }
}

function isFormSubmittable(data) {
  const dataDoc = new DOMParser().parseFromString(data, "text/html");
  const errors = dataDoc.querySelectorAll(".form-error");
  return errors.length > 0 ? false : true;
}

function insertFormErrors(formBlockActive, formError) {
  const existingError = formBlockActive.querySelector(".form-error");

  if (existingError) {
    existingError.replaceWith(formError);
  } else {
    formBlockActive.querySelector("label").after(formError);
  }
}

function resetError(formBlockActive) {
  const inputError = formBlockActive.querySelector(".form-error");
  if (inputError) inputError.remove();
}

const doFormBlocksMatch = (block1, block2) =>
  block1.dataset.field === block2.dataset.field;

// JS availablity check
if ("querySelector" in document && "addEventListener" in window) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () =>
      customElements.define("fetch-form", FetchForm),
    );
  } else {
    customElements.define("fetch-form", FetchForm);
  }
}
