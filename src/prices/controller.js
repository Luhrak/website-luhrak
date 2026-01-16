import * as model from "./model.js";
import * as image from "../service/image.js";
import { render } from "../service/render.js";
import { text } from "node:stream/consumers";

export async function priceList(ctx) {
  const prices = model.listMinimal();
  ctx.body = await render("prices.html", ctx, { prices });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export async function priceDetail(ctx) {
  const id = ctx.entryId;
  const price = model.get(id);
  ctx.body = await render("prices-detail.html", ctx, { price });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export async function addPriceForm(ctx) {
  ctx.body = await render("prices-add.html", ctx, {
    formData: {},
    formErrors: {},
  });
  ctx.status = 200;
  ctx.headers.set("content-type", "text/html");
  return ctx;
}

export async function submitPriceForm(ctx) {
  const form = await ctx.request.formData();
  const formData = Object.fromEntries(form.entries());
  const file = form.get("previewfile");

  // Price von String zu Integer konvertieren
  const price = parseInt(formData.price, 10) || 0;
  const short_description = formData.short_description || "";

  const errors = {};
  if (!formData.title) errors.title = "Title is required";
  if (price <= 0) errors.price = "Price over 0 is requried";
  if (!formData.short_description)
    errors.short_description = "Short description is required";
  if (formData.short_description.length > 90)
    errors.short_description =
      "Short description cant be longer than 90 characters";
  if (!formData.description) errors.description = "Description is required";

  const fileError = file ? image.validateImage(file) : null;
  if (fileError) errors.previewfile = fileError;

  if (Object.keys(errors).length > 0) {
    ctx.headers.set("content-type", "text/html");
    ctx.body = await render("prices-add.html", ctx, {
      formData,
      formErrors: errors,
    });
    ctx.status = 400;
    return ctx;
  }

  // Upload image falls vorhanden
  const uploadResult =
    file && file.size > 0 ? await image.uploadImage(file, "prices") : "";

  // Daten in die DB schreiben
  const id = model.add({
    previewfile: uploadResult,
    alt: formData.alt,
    title: formData.title,
    price: price,
    additions: formData.additions,
    short_description: short_description,
    description: formData.description,
  });

  ctx.status = 303;
  ctx.headers.set("Location", `/prices/${id}`);
  return ctx;
}

export async function deletePrice(ctx) {
  const price = model.get(ctx.entryId);
  if (price.previewfile) {
    image.deleteImage(price.previewfile);
  }
  model.remove(ctx.entryId);

  ctx.session.flash =
    "Price with the title " + price.title + " has been deleted";
  ctx.status = 303;
  ctx.headers.set("Location", "/prices");
  return ctx;
}

export async function editPrice(ctx) {
  const id = ctx.entryId;
  const price = model.get(id);
  ctx.body = await render("prices-add.html", ctx, {
    editing: "Edit Price",
    formData: price,
  });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export async function updatePrice(ctx) {
  const id = ctx.entryId;
  const existingPrice = model.get(id);

  const form = await ctx.request.formData();
  const file = form.get("previewfile");
  const formData = Object.fromEntries(form.entries());

  // Price und Short Description korrekt setzen
  const price = parseInt(formData.price, 10) || 0;
  const short_description = formData.short_description || "";

  const errors = {};
  if (!formData.title) errors.title = "Title is required";
  if (!formData.description) errors.description = "Description is required";
  if (price <= 0) errors.price = "Price must be greater than 0";

  if (Object.keys(errors).length > 0) {
    await addPriceFormData(ctx, formData, errors);
    return ctx;
  }

  // Datei-Upload prüfen
  if (file && file.size > 0) {
    const fileError = image.validateImage(file);
    if (fileError) {
      errors.previewfile = fileError;
      await addPriceFormData(ctx, formData, errors);
      return ctx;
    }

    const uploadResult = await image.uploadImage(file, "prices");
    if (!uploadResult) {
      errors.previewfile = "Upload failed";
      await addPriceFormData(ctx, formData, errors);
      return ctx;
    }
    formData.previewfile = uploadResult;
  } else {
    formData.previewfile = existingPrice.previewfile;
  }

  // Update in DB
  const updatedEntry = model.update(id, {
    previewfile: formData.previewfile,
    alt: formData.alt,
    title: formData.title,
    price: price,
    additions: formData.additions,
    short_description: short_description,
    description: formData.description,
  });

  ctx.session.flash =
    "Price with the title " + price.title + " has been updated";
  ctx.status = 303;
  ctx.headers.set("Location", `/prices/${updatedEntry}`);
  return ctx;
}

async function addPriceFormData(ctx, formData, errors) {
  // no redirect or export cuz only used in submit / update
  ctx.body = await render("prices-add.html", ctx, {
    formData: formData,
    formErrors: errors,
  });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
}
