import * as model from "./model.js";
import * as image from "../service/image.js";
import { render } from "../service/render.js";

export async function priceList(ctx) {
  //const prices = await model.listVisualOnly();
  const prices = model.list();
  ctx.body = await render("prices.html", { prices });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export async function priceDetail(ctx) {
  const id = ctx.entryId;
  const price = model.get(id);
  ctx.body = await render("prices-detail.html", { price });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export async function addPriceForm(ctx) {
  ctx.body = await render("prices-add.html", {
    // editing: false,
    formData: {},
    formErrors: {},
  });
  ctx.status = 200;
  ctx.headers.set("content-type", "text/html");
  return ctx;
}

export async function submitPriceForm(ctx) {
  const form = await ctx.request.formData();
  // Für Datei: get file aus formData
  const file = form.get("previewfile");
  const formData = Object.fromEntries(form.entries());

  const errors = {};
  if (!formData.title) errors.title = "Title is required";
  // I took out Data & Type as they are not needed

  if (!formData.description) errors.description = "Description is required";
  const fileError = file ? image.validateImage(file) : null;
  if (fileError) errors.previewfile = fileError;

  if (Object.keys(errors).length > 0) {
    ctx.headers.set("content-type", "text/html");
    ctx.body = await render("prices-add.html", {
      formData,
      formErrors: errors,
      // editing: false,
    });
    ctx.status = 400;
    return ctx;
  }
  const uploadResult = file ? await image.uploadImage(file) : "";

  const id = model.add({
    previewfile: uploadResult,
    title: formData.title,
    description: formData.description,
    additions: formData.additions,
  });

  ctx.status = 303;
  ctx.headers.set("Location", `/prices/${id}`);
  return ctx;
}

export async function deletePrice(ctx) {
  const price = model.get(ctx.entryId);
  image.deleteImage(price.previewfile);
  model.del(ctx.entryId);

  ctx.status = 303;
  ctx.headers.set("Location", "/prices");
  return ctx;
}

export async function editPrice(ctx) {
  const id = ctx.entryId;
  const price = model.get(id);
  ctx.body = await render("prices-add.html", {
    editing: "Edit Price",
    formData: price,
  });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 400;
  return ctx;
}

export async function updatePrice(ctx) {
  const id = ctx.entryId;
  const price = model.get(id);

  const form = await ctx.request.formData();
  const file = form.get("previewfile");
  const formData = Object.fromEntries(form.entries());

  const errors = {};
  if (!formData.title) errors.title = "Title is required";
  if (!formData.description) errors.description = "Description is required";

  if (Object.keys(errors).length > 0) {
    addPriceFormData(ctx, formData, errors);
    return ctx;
  }

  if (file && file.size > 0) {
    const fileError = image.validateImage(file);
    if (fileError) {
      errors.previewfile = fileError;
      addPriceFormData(ctx, formData, errors);
      return ctx;
    }

    const uploadResult = await image.uploadImage(file);
    if (!uploadResult) {
      errors.previewfile = "Upload failed";
      addPriceFormData(ctx, formData, errors);
      return ctx;
    }

    formData.previewfile = uploadResult;
  } else {
    formData.previewfile = price.previewfile;
  }

  const updatedEntry = model.update(id, formData);

  ctx.status = 303;
  ctx.headers.set("Location", `/prices/${updatedEntry}`);
  return ctx;
}

async function addPriceFormData(ctx, formData, errors) {
  // no redirect or export cuz only used in submit / update
  //const today = new Date().toISOString().split("T")[0];
  ctx.body = await render("prices-add.html", {
    formData: formData,
    formErrors: errors,
  });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 400;
}
