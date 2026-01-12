import * as model from "./model.js";
import * as image from "../service/image.js";
import { render } from "../service/render.js";

export async function gallery(ctx) {
  const gallery = model.listVisualOnly();
  ctx.body = await render("gallery.html", { gallery });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export async function artPiece(ctx) {
  const id = ctx.entryId;
  const art = model.get(id);
  ctx.body = await render("gallery-detailpage.html", { art });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export function deleteArtPiece(ctx) {
  const id = ctx.entryId;
  const art = model.get(id);
  image.deleteImage(art.artfile);
  model.remove(id);
  ctx.status = 303;
  ctx.headers.set("Location", `/gallery`);
  return ctx;
}

export async function galleryAdd(ctx) {
  ctx.body = await render("gallery-add.html");
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export async function addArtForm(ctx) {
  const today = new Date().toISOString().split("T")[0];
  ctx.body = await render("gallery-add.html", {
    prefillDate: today,
  });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export async function editArtPiece(ctx) {
  const id = ctx.entryId;
  const art = model.get(id);
  ctx.body = await render("gallery-add.html", {
    editing: "Edit Art",
    // Path to image is in formData.artfile but prefilling
    // input type file is not allowed in html for security
    formData: art,
  });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 400;
  return ctx;
}

export async function updateArtPiece(ctx) {
  // Read form data
  const id = ctx.entryId;
  const art = model.get(id);
  const form = await ctx.request.formData();
  const formData = Object.fromEntries(form.entries());

  // Validation
  const errors = {};
  if (!formData.title) errors.title = "Titel is required";
  if (!formData.date) errors.date = "Date is required";
  if (!formData.type) errors.type = "Type is required";

  if (Object.keys(errors).length > 0) {
    addArtFormData(ctx, formData, errors);
  } else {
    // Handling if a new file was uploaded
    if (formData.artfile) {
      const fileError = image.validateImage(formData.artfile);
      errors.artfile = fileError;
      if (Object.keys(errors).length > 0) {
        addArtFormData(ctx, formData, errors);
      }

      const uploadResult = await image.uploadImage(formData.artfile);

      // Validate Upload
      if (!uploadResult) {
        errors.artfile = "Upload failed";
        addArtFormData(ctx, formData, errors);
      } else {
        formData.artfile = uploadResult;
      }
    } else {
      // or take the old one
      formData.artfile = art.artfile;
    }

    // Update in db
    const unpdatedEntry = model.update(id, formData);

    // Redirect to uploaded detailpage (ctx.body not needed for redirect)
    ctx.status = 303;
    ctx.headers.set("Location", `/gallery/${unpdatedEntry}`);
  }
  return ctx;
}

export async function submitArtForm(ctx) {
  // Read form data
  const form = await ctx.request.formData();
  const formData = Object.fromEntries(form.entries());

  // Validation
  const errors = {};
  if (!formData.title) errors.title = "Titel is required";
  if (!formData.date) errors.date = "Date is required";
  if (!formData.type) errors.type = "Type is required";
  const fileError = image.validateImage(formData.artfile);
  if (fileError) errors.artfile = fileError;

  if (Object.keys(errors).length > 0) {
    addArtFormData(ctx, formData, errors);
  } else {
    const uploadResult = await image.uploadImage(formData.artfile);

    // Validate Upload
    if (!uploadResult) {
      errors.artfile = "Upload failed";
      addArtFormData(ctx, formData, errors);
    }

    // Save to db
    const newEntry = model.add({
      title: formData.title,
      artfile: uploadResult, // Path as string
      alt: formData.alt,
      date: formData.date,
      type: formData.type,
      description: formData.description,
    });
    // Redirect to uploaded detailpage (ctx.body not needed for redirect)
    ctx.status = 303;
    ctx.headers.set("Location", `/gallery/${newEntry}`);
  }
  return ctx;
}

async function addArtFormData(ctx, formData, errors) {
  // no redirect or export cuz only used in submit / update
  const today = new Date().toISOString().split("T")[0];
  ctx.body = await render("gallery-add.html", {
    prefillDate: formData.date,
    formData: formData,
    formErrors: errors,
  });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 400;
}
