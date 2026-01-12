import { listVisualOnly } from "../gallery/model.js";
import { render } from "../service/render.js";

// Main Pages
export async function index(ctx) {
  const gallery = listVisualOnly();
  ctx.body = await render("index.html", { gallery });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export async function projects(ctx) {
  ctx.body = await render("projects.html");
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export async function about(ctx) {
  ctx.body = await render("about.html");
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

// Misc
export async function impressum(ctx) {
  ctx.body = await render("legalPages/impressum.html");
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export async function privacyPolicy(ctx) {
  ctx.body = await render("legalPages/privacy-policy.html");
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export async function error404(ctx) {
  ctx.body = await render("errorPages/error404.html");
  ctx.headers.set("content-type", "text/html");
  ctx.status = 404;
  return ctx;
}

export async function error403(ctx) {
  ctx.body = await render("errorPages/error403.html");
  ctx.headers.set("content-type", "text/html");
  ctx.status = 403;
  return ctx;
}

// Detail Pages
export async function priceHeadshot(ctx) {
  // Remove eventually
  ctx.body = await render("detailPages/price-headshot.html");
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export async function priceSticker(ctx) {
  // Remove eventually
  ctx.body = await render("detailPages/price-sticker.html");
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export async function projectFursuit(ctx) {
  ctx.body = await render("detailPages/project-fursuit.html");
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export async function projectStickers(ctx) {
  ctx.body = await render("detailPages/project-stickers.html");
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}
