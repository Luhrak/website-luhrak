class FetchForm extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    updateButton(this);
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
    const formBlockActive = e.target.closest(".input-block");
    if (!formBlockActive) return;
    resetError(formBlockActive);
    updateButton(this);
  }
}

async function updateButton(thisFetchForm) {
  const form = thisFetchForm.querySelector("form");
  const submitButtons = form.querySelectorAll("button");
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
    const hasErrors = !isSubmittable(data.data);
    if (hasErrors) {
      for (var i = 0; i < submitButtons.length; i++) {
        submitButtons.item(i).classList.add("button-unclickable");
        submitButtons.item(i).disabled = true;
      }
    } else {
      for (var i = 0; i < submitButtons.length; i++) {
        submitButtons.item(i).classList.remove("button-unclickable");
        submitButtons.item(i).disabled = false;
      }
    }
  }
}

async function updateError(form, formBlockActive) {
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
    const formError = isFormBlockSubmittable(formBlockActive, data.data);
    if (!formError) return;
    insertFormErrors(formBlockActive, formError);
  }
}

function isFormBlockSubmittable(formBlockActive, data) {
  const dataDoc = new DOMParser().parseFromString(data, "text/html");
  const formBlocks = dataDoc.querySelectorAll(".input-block");

  for (var i = 0; i < formBlocks.length; i++) {
    if (doFormBlocksMatch(formBlockActive, formBlocks.item(i)))
      return formBlocks.item(i).querySelector(".form-error");
  }
}

function isSubmittable(data) {
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
