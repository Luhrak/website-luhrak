import * as model from "./model.js";
import * as image from "../service/image.js";
import * as priceModel from "../prices/model.js";
import { render } from "../service/render.js";

export async function gallery(ctx) {
  // Handling of page with the gallery overview
  const priceId = ctx.url.searchParams.get("price");
  const gallery = priceId
    ? model.listByPriceId(Number(priceId))
    : model.listMinimal();
  const prices = priceModel.listMinimal();
  const activePrice = priceId ? Number(priceId) : null;

  ctx.body = await render("gallery.html", ctx, {
    gallery,
    prices,
    activePrice,
  });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export async function galleryDetail(ctx) {
  // Handling of page of a single art piece
  const id = ctx.entryId;
  const art = model.get(id);
  ctx.body = await render("gallery-detailpage.html", ctx, { art });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export async function galleryAdd(ctx) {
  // Handling of page with the formular to add a new art piece
  const today = new Date().toISOString().split("T")[0];
  const prices = priceModel.listMinimal();
  ctx.body = await render("gallery-add.html", ctx, {
    prefillDate: today,
    prices,
  });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export async function galleryEdit(ctx) {
  // Handling of page with the formular to edit an existing art piece
  const id = ctx.entryId;
  const art = model.get(id);
  const prices = priceModel.listMinimal();
  ctx.body = await render("gallery-add.html", ctx, {
    editing: "Edit Art",
    // We have formData.previewfile for input prefilling
    // however cant prefill files in html for security
    formData: art,
    prices,
  });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}
