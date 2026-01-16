import { listMinimal as listGallery } from "../gallery/model.js";
import { listMinimal as listPrices } from "../prices/model.js";
import { render } from "../service/render.js";

// Main Pages
export async function index(ctx) {
  const gallery = listGallery();
  const prices = listPrices();
  ctx.body = await render("index.html", ctx, { gallery, prices });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export async function projects(ctx) {
  ctx.body = await render("projects.html", ctx);
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export async function about(ctx) {
  ctx.body = await render("about.html", ctx);
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

// Misc pages
export async function impressum(ctx) {
  ctx.body = await render("legalPages/impressum.html", ctx);
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export async function privacyPolicy(ctx) {
  ctx.body = await render("legalPages/privacy-policy.html", ctx);
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export async function error404(ctx) {
  ctx.body = await render("errorPages/error404.html", ctx);
  ctx.headers.set("content-type", "text/html");
  ctx.status = 404;
  return ctx;
}

export async function error403(ctx) {
  ctx.body = await render("errorPages/error403.html", ctx);
  ctx.headers.set("content-type", "text/html");
  ctx.status = 403;
  return ctx;
}

// Project Pages
export async function projectFursuit(ctx) {
  ctx.body = await render("projectPages/fursuit.html", ctx);
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export async function projectStickers(ctx) {
  ctx.body = await render("projectPages/stickers.html", ctx);
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}
