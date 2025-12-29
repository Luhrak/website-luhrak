import { add } from "../gallery/model.js";
import { render } from "../service/render.js";

export async function addArt(ctx) {
  const today = new Date().toISOString().split("T")[0];
  ctx.body = render("form.html", {
    prefillDate: today,
    formData: {},
    formErrors: {},
  });
  ctx.headers.set("content-type", "text/html; charset=utf-8");
  ctx.status = 200;
  return ctx;
}

export async function createArt(ctx) {
  // Read form data
  const form = await ctx.request.formData();
  const formData = Object.fromEntries(form.entries());

  // Validation
  const errors = {};
  if (!formData.title) errors.title = "Titel is required";
  if (!formData.topic) errors.topic = "Topic is required";
  if (!formData.date) {
    errors.date = "Date is required";
  } else {
    // Usually doesnt come up but just in case:
    const ts = Date.parse(formData.date);
    if (isNaN(ts)) {
      errors.date = "Please put in a valid date format: JJJJ-MM-TT";
    }
  }
  if (!formData.text) errors.text = "Text is required";

  if (Object.keys(errors).length > 0) {
    // Show user input errors
    const today = new Date().toISOString().split("T")[0];
    ctx.status = 400;
    ctx.headers.set("content-type", "text/html; charset=utf-8");
    ctx.body = render("form.html", {
      prefillDate: formData.date,
      formData,
      formErrors: errors,
    });
  } else {
    // Save to db and redirect to new detailpage
    const newNote = add({
      title: formData.title,
      topic: formData.topic,
      text: formData.text,
      date: formData.date,
    });
    ctx.status = 303;
    ctx.headers.set("Location", `/note/${newNote}`);
    // body not needed
  }
  return ctx;
}
