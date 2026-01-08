import * as model from "./model.js";
import * as image from "../service/image.js";
import { render } from "../service/render.js";

export const priceList = async (ctx) => {
  const prices = await model.listVisualOnly();
  ctx.body = render("prices.html", { prices });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
};

export const priceDetail = async (ctx) => {
    const id = ctx.entryId;
  const price = await model.get(id);
  ctx.body = render("prices-detail.html", { price });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
};

export const addPriceForm = async (ctx) => {
  ctx.body = render("prices-add.html", {
   // editing: false,
    formData: {},
    formErrors: {},
  });
  ctx.status = 200;
  ctx.headers.set("content-type", "text/html");
  return ctx;
};

export const submitPriceForm = async (ctx) => {
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
    ctx.body = render("prices-add.html", {
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
};

export const deletePrice = async (ctx) => {
  const price = await model.get(ctx.entryId);
  image.deleteImage(price.previewfile);
  model.del(ctx.entryId);

  ctx.status = 303;
  ctx.headers.set("Location", "/prices");
  return ctx;
};

export async function editPrice(ctx) {
  const id = ctx.entryId;
  const price = await model.get(id);
  ctx.body = render("prices-add.html", {
    editing: "Edit Price",
    formData: price,
  });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 400;
  return ctx;
}

export async function updatePrice(ctx) {
  // Read form data
  const id = ctx.entryId;
  const price = await model.get(id);
  const form = await ctx.request.formData();
    // Für Datei: get file aus formData
  const file = form.get("previewfile");
  const formData = Object.fromEntries(form.entries());

  // Validation
  const errors = {};
  if (!formData.title) errors.title = "Titel is required";
  if (!formData.type) errors.type = "Type is required";

  if (Object.keys(errors).length > 0) {
    addPriceFormData(ctx, formData, errors);
  } else {
    // Handling if a new file was uploaded
    if (formData.previewfile) {
      const fileError = image.validateImage(formData.previewfile);
      errors.previewfile = fileError;
      if (Object.keys(errors).length > 0) {
        addPriceFormData(ctx, formData, errors);
      }

      const uploadResult = await image.uploadImage(formData.previewfile);

      // Validate Upload
      if (!uploadResult) {
        errors.previewfile = "Upload failed";
        addPriceFormData(ctx, formData, errors);
      } else {
        formData.previewfile = uploadResult;
      }
    } else {
      // or take the old one
      formData.previewfile = price.previewfile;
    }

    // Update in db
    const unpdatedEntry = model.update(id, formData);

    // Redirect to uploaded detailpage (ctx.body not needed for redirect)
    ctx.status = 303;
    ctx.headers.set("Location", `/prices/${unpdatedEntry}`);
  }
  return ctx;
}

function addPriceFormData(ctx, formData, errors) {
  // no redirect or export cuz only used in submit / update
  //const today = new Date().toISOString().split("T")[0];
  ctx.body = render("prices-add.html", {
    
    formData: formData,
    formErrors: errors,
  });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 400;
}