import { render } from "../service/render.js";

// Main Pages
export const index = async (ctx) => {
  ctx.body = await render("index.html");
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
};

export const gallery = async (ctx) => {
  ctx.body = await render("gallery.html");
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
};

export const prices = async (ctx) => {
  ctx.body = await render("prices.html");
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

// 404
export const error404 = async (ctx) => {
  ctx.body = await render("error404.html");
  ctx.headers.set("content-type", "text/html");
  ctx.status = 404;
  return ctx;
};

// Legal
export const impressum = async (ctx) => {
  ctx.body = await render("legal/impressum.html");
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
};

export const privacyPolicy = async (ctx) => {
  ctx.body = await render("legal/privacy-policy.html");
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
};

// Detail Pages
export const artRaimond = async (ctx) => {
  ctx.body = await render("detailpage/art-raimond.html");
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
};

export const artStargaze = async (ctx) => {
  ctx.body = await render("detailpage/art-stargaze.html");
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
};

export const priceHeadshot = async (ctx) => {
  ctx.body = await render("detailpage/price-headshot.html");
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
};

export const priceSticker = async (ctx) => {
  ctx.body = await render("detailpage/price-sticker.html");
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
};

export const projectFursuit = async (ctx) => {
  ctx.body = await render("detailpage/project-fursuit.html");
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
};

export const projectStickers = async (ctx) => {
  ctx.body = await render("detailpage/project-stickers.html");
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
};
