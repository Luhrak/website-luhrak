class FetchForm extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.addEventListener("focusout", this.handler);
    this.addEventListener("keydown", this.resetter);
  }

  disconnectedCallback() {
    this.removeEventListener("focusout", this.handler);
    this.removeEventListener("keydown", this.resetter);
  }

  handler(e) {
    const form = e.target.closest("form") || this.querySelector("form");
    const formBlockActive = e.target.closest(".input-block");
    if (!form || !formBlockActive) return;
    update(form, formBlockActive);
  }

  resetter(e) {
    const formBlockActive = e.target.closest(".input-block");
    if (!formBlockActive) return;
    reset(formBlockActive);
  }
}

async function update(form, formBlockActive) {
  const formData = new FormData(form);
  formData.append("partial", true);

  const { data, error } = await safeFetchText(form.action, {
    method: "POST",
    headers: {},
    body: formData,
  });

  if (error) {
    console.error("safe fetch error:");
    console.error(error);
    return;
  }

  if (data) {
    const formError = getFormError(formBlockActive, data.data);
    if (!formError) return;
    insertFormErrors(formBlockActive, formError);
  }
}

function getFormError(formBlockActive, data) {
  const dataDoc = new DOMParser().parseFromString(data, "text/html");
  const formBlocks = dataDoc.querySelectorAll(".input-block");

  for (var i = 0; i < formBlocks.length; i++) {
    if (doFormBlocksMatch(formBlockActive, formBlocks.item(i)))
      return formBlocks.item(i).querySelector(".form-error");
  }
}

function insertFormErrors(formBlockActive, formError) {
  const existingError = formBlockActive.querySelector(".form-error");

  if (existingError) {
    existingError.replaceWith(formError);
  } else {
    formBlockActive.querySelector("label").after(formError);
  }
}

function reset(formBlockActive) {
  const inputError = formBlockActive.querySelector(".form-error");
  if (inputError) inputError.remove();
}

const doFormBlocksMatch = (block1, block2) =>
  block1.dataset.field === block2.dataset.field;

async function safeFetchText(url, options) {
  let response;
  try {
    response = await fetch(url, options);
    if (!response.ok) {
      return { error: response.status, response };
    }
  } catch (error) {
    return { error: { status: 559, message: error.message } };
  }
  try {
    return { data: { data: await response.text(), response } };
  } catch (error) {
    return { error: { status: 599, message: error.message } };
  }
}

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
