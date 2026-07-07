import { listMinimal as listGallery } from "../feature/gallery/model.js";
import { listMinimal as listPrices } from "../feature/prices/model.js";
import { render } from "../service/render.js";
import { encodeBase64 } from "jsr:@std/encoding/base64";

// Main Pages:
export async function index(ctx) {
  // Handling of the homepage
  const gallery = await listGallery();
  const prices = await listPrices();
  ctx.body = await render("index.html", ctx, {
    gallery: gallery.map(artfileAsBlob),
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

export async function projects(ctx) {
  // Handling of page with the project overview
  ctx.body = await render("projects.html", ctx);
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export async function about(ctx) {
  // Handling of page with information about me
  ctx.body = await render("about.html", ctx);
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

// Misc pages
export async function impressum(ctx) {
  // Handling of the impressum page
  ctx.body = await render("legalPages/impressum.html", ctx);
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export async function privacyPolicy(ctx) {
  // Handling of privacy policy page
  ctx.body = await render("legalPages/privacy-policy.html", ctx);
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export async function error404(ctx) {
  // Handling of 404 error page
  ctx.body = await render("errorPages/error404.html", ctx);
  ctx.headers.set("content-type", "text/html");
  ctx.status = 404;
  return ctx;
}

export async function error403(ctx) {
  // Handling of 403 error page
  ctx.body = await render("errorPages/error403.html", ctx);
  ctx.headers.set("content-type", "text/html");
  ctx.status = 403;
  return ctx;
}

// Project Pages
export async function projectFursuit(ctx) {
  // Handling of detailpage with fursuit project
  ctx.body = await render("projectPages/fursuit.html", ctx);
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export async function projectStickers(ctx) {
  // Handling of detailpage with stickers project
  ctx.body = await render("projectPages/stickers.html", ctx);
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}
