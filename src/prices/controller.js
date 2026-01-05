import * as model from "./model.js";
import * as image from "../service/image.js";
import { render } from "../service/render.js";

export const priceList = async (ctx) => {
  const prices = model.listVisualOnly();
  ctx.body = render("price.html", { prices });
  ctx.status = 200;
};

export const priceDetail = async (ctx) => {
  const price = model.get(ctx.entryId);
  ctx.body = render("price-detail.html", { price });
  ctx.status = 200;
};

export const addPriceForm = async (ctx) => {
  const today = new Date().toISOString().slice(0, 10);

  ctx.body = render("price-add.html", {
    editing: false,
    formData: {},
    formErrors: {},
    prefillDate: today,
  });
  ctx.status = 200;
};


export const submitPriceForm = async (ctx) => {
  const form = await ctx.request.formData();
  const formData = Object.fromEntries(form.entries());

  // Für Datei: get file aus formData
  const file = form.get("artfile");

  const errors = {};
  if (!formData.title) errors.title = "Title is required";
  if (!formData.type) errors.type = "Type is required";
  if (!formData.date) errors.date = "Date is required";

  const fileError = file ? image.validateImage(file) : null;
  if (fileError) errors.artfile = fileError;

  if (Object.keys(errors).length > 0) {
    ctx.body = render("price-add.html", {
      formData,
      formErrors: errors,
      prefillDate: formData.date || new Date().toISOString().slice(0, 10),
      editing: false,
    });
    ctx.status = 400;
    return;
  }

  const uploadResult = file ? await image.uploadImage(file) : "";

  const id = model.add({
    artfile: uploadResult,
    title: formData.title,
    type: formData.type,
    date: formData.date,
    description: formData.description,
    additions: formData.additions,
  });

  ctx.status = 303;
  ctx.headers.set("Location", `/price/${id}`);
};

export const deletePrice = async (ctx) => {
  const price = model.get(ctx.entryId);
  image.deleteImage(price.artfile);
  model.del(ctx.entryId);

  ctx.status = 303;
  ctx.headers.set("Location", "/price");
};
