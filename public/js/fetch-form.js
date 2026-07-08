import { safeFetchText } from "./helper/safeFetchText.js";

class FetchForm extends HTMLElement {
  constructor() {
    super();
    this.timer = null;
  }

  connectedCallback() {
    updateSubmitButton(this);
    this.addEventListener("focusout", this.focusoutHandler);
    this.addEventListener("input", this.inputHandler);
  }

  disconnectedCallback() {
    this.removeEventListener("focusout", this.focusoutHandler);
    this.removeEventListener("input", this.inputHandler);
  }

  focusoutHandler(e) {
    const form = e.target.closest("form") || this.querySelector("form");
    const formBlockActive = e.target.closest(".input-block");
    if (!form || !formBlockActive) return;
    updateError(form, formBlockActive);
  }

  inputHandler(e) {
    // Timer for preventing too many rapid api calls while typing
    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      const formBlockActive = e.target.closest(".input-block");
      if (!formBlockActive) return;
      resetError(formBlockActive);
      updateSubmitButton(this);
    }, 500);
  }
}

async function updateSubmitButton(thisFetchForm) {
  const form = thisFetchForm.querySelector("form");

  updateFromForm(form, (data) => {
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

async function updateError(form, formBlockActive) {
  updateFromForm(form, (data) => {
    const formError = getFormBlockError(formBlockActive, data.data);
    if (!formError) return;
    insertFormErrors(formBlockActive, formError);
  });
}

async function updateFromForm(form, onData) {
  const formData = new FormData(form);
  formData.append("partial", true);

  const { data, error } = await safeFetchText(form.action, {
    method: "POST",
    headers: {},
    body: formData,
  });

  if (error) {
    console.error("safe fetch error:", error);
    return;
  }

  if (data) {
    onData(data);
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
