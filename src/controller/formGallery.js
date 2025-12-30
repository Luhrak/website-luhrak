import { add } from "../gallery/model.js";
import { render } from "../service/render.js";
import { validateImage, uploadImage } from "../service/image.js";

export async function addArt(ctx) {
  const today = new Date().toISOString().split("T")[0];
  ctx.body = render("gallery-add.html", {
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
  if (!formData.date) errors.date = "Date is required";
  if (!formData.type) errors.type = "Type is required";
  if (!formData.artfile) errors.artfile = validateImage();

  if (Object.keys(errors).length > 0) {
    prefilledFormWithErrors(ctx, formData, errors);
  } else {
    const uploadResult = await uploadImage(formData.artfile);

    // Validate Upload
    if (!uploadResult) {
      errors.artfile = "Upload failed";
      prefilledFormWithErrors(ctx, formData, errors);
    }

    // Save to db
    const newNote = add({
      title: formData.title,
      artfile: uploadResult, // Path as string
      alt: formData.alt,
      date: formData.date,
      type: formData.type,
      description: formData.description,
    });
    // Eedirect to uploaded detailpage (ctx.body not needed for redirect)
    ctx.status = 303;
    ctx.headers.set("Location", `/gallery/${newNote}`);
  }
  return ctx;
}

function prefilledFormWithErrors(ctx, formData, errors) {
  const today = new Date().toISOString().split("T")[0];
  ctx.status = 400;
  ctx.headers.set("content-type", "text/html; charset=utf-8");
  ctx.body = render("gallery-add.html", {
    prefillDate: formData.date,
    formData,
    formErrors: errors,
  });
}
