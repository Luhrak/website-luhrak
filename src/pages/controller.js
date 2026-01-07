import { listVisualOnly } from "../gallery/model.js";
import { render } from "../service/render.js";

// Main Pages
export const index = async (ctx) => {
  const gallery = listVisualOnly();
  ctx.body = await render("index.html", { gallery });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
};



export const projects = async (ctx) => {
  ctx.body = await render("projects.html");
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
};

export const about = async (ctx) => {
  ctx.body = await render("about.html");
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
};

// Misc
export const impressum = async (ctx) => {
  ctx.body = await render("legalPages/impressum.html");
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
};

export const privacyPolicy = async (ctx) => {
  ctx.body = await render("legalPages/privacy-policy.html");
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
};

export const error404 = async (ctx) => {
  ctx.body = await render("errorPages/error404.html");
  ctx.headers.set("content-type", "text/html");
  ctx.status = 404;
  return ctx;
};

export const error403 = async (ctx) => {
  ctx.body = await render("errorPages/error403.html");
  ctx.headers.set("content-type", "text/html");
  ctx.status = 403;
  return ctx;
};

// Detail Pages
export const priceHeadshot = async (ctx) => {
  // Remove eventually
  ctx.body = await render("detailPages/price-headshot.html");
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
};

export const priceSticker = async (ctx) => {
  // Remove eventually
  ctx.body = await render("detailPages/price-sticker.html");
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
};

export const projectFursuit = async (ctx) => {
  ctx.body = await render("detailPages/project-fursuit.html");
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
};

export const projectStickers = async (ctx) => {
  ctx.body = await render("detailPages/project-stickers.html");
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
};
