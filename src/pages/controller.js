import { render } from "../service/render.js";

// Main Pages
export const index = async (ctx) => {
  ctx.response.body = await render("index.html", {});
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
};

export const gallery = async (ctx) => {
  ctx.response.body = await render("gallery.html");
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
};

export const prices = async (ctx) => {
  ctx.response.body = await render("prices.html");
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
};

export const projects = async (ctx) => {
  ctx.response.body = await render("projects.html");
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
};

export const about = async (ctx) => {
  ctx.response.body = await render("about.html");
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
};

// Legal
export const impressum = async (ctx) => {
  ctx.response.body = await render("legal/impressum.html");
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
};

export const privacyPolicy = async (ctx) => {
  ctx.response.body = await render("legal/privacy-policy.html");
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
};

// Detail Pages
export const artRaimond = async (ctx) => {
  ctx.response.body = await render("detailpage/art-raimond.html");
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
};

export const artStargaze = async (ctx) => {
  ctx.response.body = await render("detailpage/art-stargaze.html");
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
};

export const priceHeadshot = async (ctx) => {
  ctx.response.body = await render("detailpage/price-headshot.html");
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
};

export const priceSticker = async (ctx) => {
  ctx.response.body = await render("detailpage/price-sticker.html");
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
};

export const projectFursuit = async (ctx) => {
  ctx.response.body = await render("detailpage/project-fursuit.html");
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
};

export const projectStickers = async (ctx) => {
  ctx.response.body = await render("detailpage/project-stickers.html");
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
};
