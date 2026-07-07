import * as model from "./model.js";
import * as image from "../../service/image.js";
import * as priceModel from "../prices/model.js";
import { render } from "../../service/render.js";
import { encodeBase64 } from "jsr:@std/encoding/base64";

export async function gallery(ctx) {
  // Handling of page with the gallery overview
  const priceId = ctx.url.searchParams.get("price");
  const gallery = priceId
    ? await model.listByPriceId(Number(priceId))
    : await model.listMinimal();
  const prices = await priceModel.listMinimal();
  const activePrice = priceId ? Number(priceId) : null;

  ctx.body = await render("gallery.html", ctx, {
    gallery: gallery.map(artfileAsBlob),
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
  const art = await model.get(id);
  ctx.body = await render("gallery-detailpage.html", ctx, {
    art: artfileAsBlob(art),
  });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export async function galleryAdd(ctx) {
  // Handling of page with the formular to add a new art piece
  const today = new Date().toISOString().split("T")[0];
  const prices = await priceModel.listMinimal();
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
  const art = await model.get(id);
  const prices = await priceModel.listMinimal();
  ctx.body = await render("gallery-add.html", ctx, {
    editing: "Edit Art",
    // We have formData.previewfile for input prefilling
    // however cant prefill files in html for security
    formData: artfileAsBlob(art),
    prices,
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
