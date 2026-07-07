import * as model from "./model.js";
import * as image from "../../service/image.js";
import * as galleryModel from "../gallery/model.js";
import * as priceModel from "../prices/model.js";
import { render } from "../../service/render.js";
import { text } from "node:stream/consumers";
import { encodeBase64 } from "jsr:@std/encoding/base64";

export async function prices(ctx) {
  // Handling of page with the prices overview
  const prices = await model.listMinimal();
  ctx.body = await render("prices.html", ctx, { prices });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export async function pricesDetail(ctx) {
  // Handling of page of a single price listing
  const id = ctx.entryId;
  const price = await model.get(id);
  const gallery = await galleryModel.listByPrice(price.id);
  ctx.body = await render("prices-detail.html", ctx, {
    price,
    gallery: gallery.map(artfileAsBlob),
  });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

const artfileAsBlob = (galleryItem) => {
  const blob = encodeBase64(galleryItem.artfile);
  galleryItem.artfile = `data:image/png;base64,${blob}`;
  return galleryItem;
};

export async function pricesAdd(ctx) {
  // Handling of page with the formular to add a new price listing
  ctx.body = await render("prices-add.html", ctx);
  ctx.status = 200;
  ctx.headers.set("content-type", "text/html");
  return ctx;
}

export async function pricesEdit(ctx) {
  // Handling of page with the formular to edit an existing price listing
  const id = ctx.entryId;
  const price = await model.get(id);
  ctx.body = await render("prices-add.html", ctx, {
    editing: "Edit Price",
    // We have formData.previewfile for input prefilling
    // however cant prefill files in html for security
    formData: price,
  });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}
