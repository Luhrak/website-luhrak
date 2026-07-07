import * as model from "./model.js";
import * as gallery from "../gallery/model.js";
import * as image from "../../service/image.js";
import { render } from "../../service/render.js";
import { text } from "node:stream/consumers";

export async function pricesSubmit(ctx) {
  // Handling when submiting a new price listing
  // Read form data
  const form = await ctx.request.formData();
  const formData = Object.fromEntries(form.entries());
  formData.price = parseInt(formData.price, 10) || 0;
  const deleteImage = form.get("deleteImage");
  // Validation
  const errors = {};
  if (!formData.title) errors.title = "Title is required";
  if (formData.price <= 0) errors.price = "Price over 0 is requried";
  if (!formData.short_description)
    errors.short_description = "Short description is required";
  if (formData.short_description.length > 90)
    errors.short_description =
      "Short description cant be longer than 90 characters";
  if (!formData.description) errors.description = "Description is required";

  // image is optional so only check if given
  const hasFile = formData.previewfile && Number(formData.previewfile.size) > 0;
  if (hasFile) {
    const fileError = image.validateImage(formData.previewfile);
    if (fileError !== undefined) errors.previewfile = fileError;
  }

  if (Object.keys(errors).length > 0 || formData.partial) {
    await pricesAddWithData(ctx, formData, errors);
  } else {
    // Handling if a new file was uploaded
    if (hasFile) {
      const uploadResult = await image.uploadImage(
        formData.previewfile,
        "prices",
      );

      // Validate if Upload worked
      if (!uploadResult) {
        errors.previewfile = "Upload failed";
        await pricesAddWithData(ctx, formData, errors);
      } else {
        formData.previewfile = uploadResult;
      }
    } else {
      formData.previewfile = null;
    }

    // Save to db
    const id = await model.add(formData);
    // Redirect to uploaded detailpage (ctx.body not needed for redirect)
    ctx.status = 303;
    ctx.headers.set("Location", `/prices/${id}`);
  }
  return ctx;
}

async function pricesAddWithData(ctx, formData, errors) {
  // When there is an error, this sends back to the new price form page with the errors
  // no redirect or export cuz function calling this returns the context already
  ctx.body = await render("prices-add.html", ctx, {
    formData: formData,
    formErrors: errors,
  });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
}

export async function pricesUpdate(ctx) {
  // Handling when submiting the form to edit a price listing
  // Read form data
  const id = ctx.entryId;
  const existingPrice = await model.get(id);
  const form = await ctx.request.formData();
  const formData = Object.fromEntries(form.entries());
  const deleteImage = form.get("deleteImage");
  const hasNewFile =
    formData.previewfile && Number(formData.previewfile.size) > 0;
  formData.price = parseInt(formData.price, 10) || 0;

  // Validation
  const errors = {};
  if (!formData.title) errors.title = "Title is required";
  if (formData.price <= 0) errors.price = "Price over 0 is requried";
  if (!formData.short_description)
    errors.short_description = "Short description is required";
  if (formData.short_description.length > 90)
    errors.short_description =
      "Short description cant be longer than 90 characters";
  if (!formData.description) errors.description = "Description is required";

  // image replacing is optional so only check if given
  if (hasNewFile) {
    const fileError = image.validateImage(formData.previewfile);
    if (fileError !== undefined) errors.previewfile = fileError;
  }

  if (Object.keys(errors).length > 0 || formData.partial) {
    await pricesEditWithData(ctx, formData, errors);
  } else {
    // Handling if a new file was uploaded

    // Delete or repalce image
    if (deleteImage && existingPrice.previewfile) {
      await image.deleteImage(existingPrice.previewfile);
      formData.previewfile = "";
    } else if (hasNewFile) {
      const uploadResult = await image.uploadImage(
        formData.previewfile,
        "prices",
      );

      if (!uploadResult) {
        errors.previewfile = "Upload failed";
        await pricesEditWithData(ctx, formData, errors);
        return ctx;
      }
      // Delete old one and use new one
      if (existingPrice.previewfile)
        await image.deleteImage(existingPrice.previewfile);
      formData.previewfile = uploadResult;
    } else {
      // or take the old one
      formData.previewfile = existingPrice.previewfile;
    }

    // Update in db
    const updatedEntry = await model.update(id, formData);

    // Redirect to uploaded detailpage (ctx.body not needed for redirect)
    ctx.session.content.flash =
      'Price "' + formData.title + '" has been updated';
    ctx.status = 303;
    ctx.headers.set("Location", `/prices/${updatedEntry}`);
  }
  return ctx;
}

async function pricesEditWithData(ctx, formData, errors) {
  // When there is an error, this sends back to the edit price form page with the errors
  // no redirect or export cuz function calling this returns the context already

  // Replace any missing data from previous state
  const id = ctx.entryId;
  const price = await model.get(id);
  formData.id = price.id;
  formData.previewfile = price.previewfile;
  if ("title" in errors) formData.title = price.title;
  if ("price" in errors) formData.price = price.price;
  if ("short_description" in errors)
    formData.short_description = price.short_description;
  if ("description" in errors) formData.description = price.description;

  ctx.body = await render("prices-add.html", ctx, {
    editing: "Edit Price",
    formData: formData,
    formErrors: errors,
  });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
}

export async function pricesDelete(ctx) {
  // Deleting a single price listing from db and the file
  const price = await model.get(ctx.entryId);
  if (price.previewfile) {
    await image.deleteImage(price.previewfile);
  }
  await model.remove(ctx.entryId);

  ctx.session.content.flash = 'Price "' + price.title + '" has been deleted';
  ctx.status = 303;
  ctx.headers.set("Location", "/prices");
  return ctx;
}
