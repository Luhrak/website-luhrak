import * as model from "./model.js";
import * as image from "../../service/image.js";
import * as priceModel from "../prices/model.js";
import { render } from "../../service/render.js";

export async function gallerySubmit(ctx) {
  // Handling when submiting a new art piece
  // Read form data
  const form = await ctx.request.formData();
  const formData = Object.fromEntries(form.entries());
  const priceId = formData.price_id ? parseInt(formData.price_id, 10) : null;

  // Validation
  const errors = {};
  if (!formData.title) errors.title = "Titel is required";
  if (!formData.date) errors.date = "Date is required";
  const fileError = image.validateImage(formData.artfile);
  if (fileError) errors.artfile = fileError;

  if (Object.keys(errors).length > 0 || formData.partial) {
    await galleryAddWithData(ctx, formData, errors);
  } else {
    const uploadResult = await image.uploadImage(formData.artfile, "gallery");

    // Validate if Upload worked
    if (!uploadResult) {
      errors.artfile = "Upload failed";
      await galleryAddWithData(ctx, formData, errors);
    }

    // Save to db
    const newEntry = await model.add({
      title: formData.title,
      artfile: uploadResult, // Path as string
      alt: formData.alt,
      date: formData.date,
      description: formData.description,
      price_id: priceId,
    });
    // Redirect to uploaded detailpage (ctx.body not needed for redirect)
    ctx.status = 303;
    ctx.headers.set("Location", `/gallery/${newEntry}`);
  }
  return ctx;
}

async function galleryAddWithData(ctx, formData, errors) {
  // When there is an error, this sends back to the new art form page with the errors
  // no redirect or export cuz function calling this returns the context already
  const prices = await priceModel.listMinimal();
  const today = new Date().toISOString().split("T")[0];
  ctx.body = await render("gallery-add.html", ctx, {
    prefillDate: formData.date,
    formData: formData,
    formErrors: errors,
    prices,
  });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
}

export async function galleryUpdate(ctx) {
  // Handling when submiting the form to edit an art piece
  const id = ctx.entryId;
  const existingArt = await model.get(id);
  const form = await ctx.request.formData();
  const formData = Object.fromEntries(form.entries());
  const priceId = formData.price_id ? parseInt(formData.price_id, 10) : null;
  const hasNewFile = formData.artfile && Number(formData.artfile.size) > 0;

  // Validation
  const errors = {};
  if (!formData.title) errors.title = "Titel is required";
  if (!formData.date) errors.date = "Date is required";

  // image replacing is optional so only check if given
  if (hasNewFile) {
    const fileError = image.validateImage(formData.artfile);
    if (fileError !== undefined) errors.artfile = fileError;
  }

  if (Object.keys(errors).length > 0 || formData.partial) {
    await galleryEditWithData(ctx, formData, errors);
  } else {
    // Handling if a new file was uploaded
    if (hasNewFile) {
      const uploadResult = await image.uploadImage(formData.artfile, "gallery");

      // Validate if Upload worked
      if (!uploadResult) {
        errors.artfile = "Upload failed";
        await galleryEditWithData(ctx, formData, errors);
      } else {
        // Delete old one and use new one
        if (existingArt.artfile) await image.deleteImage(existingArt.artfile);
        formData.artfile = uploadResult;
      }
    } else {
      // or take the old one
      formData.artfile = existingArt.artfile;
    }

    // Update in db
    const unpdatedEntry = await model.update(id, formData);

    // Redirect to uploaded detailpage (ctx.body not needed for redirect)
    ctx.session.content.flash =
      'Artpost "' + formData.title + '" has been updated';
    ctx.status = 303;
    ctx.headers.set("Location", `/gallery/${unpdatedEntry}`);
  }
  return ctx;
}

async function galleryEditWithData(ctx, formData, errors) {
  // When there is an error, this sends back to the edit art form page with the errors
  // no redirect or export cuz function calling this returns the context already
  const today = new Date().toISOString().split("T")[0];

  // Replace any missing data from previous state
  const id = ctx.entryId;
  const art = await model.get(id);
  formData.id = art.id;
  // formData.artfile = art.artfile;
  if ("title" in errors) formData.title = art.title;

  ctx.body = await render("gallery-add.html", ctx, {
    editing: "Edit Art",
    prefillDate: formData.date ?? today,
    formData: formData,
    formErrors: errors,
  });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
}

export async function galleryDelete(ctx) {
  // Deleting a single artpiece from db and the file
  const id = ctx.entryId;
  const art = await model.get(id);
  await image.deleteImage(art.artfile);
  await model.remove(id);

  ctx.session.content.flash = 'Artpost "' + art.title + '" has been deleted';
  ctx.status = 303;
  ctx.headers.set("Location", `/gallery`);
  return ctx;
}
