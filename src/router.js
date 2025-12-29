import * as pages from "./controller/pages.js";

// Match requests with known pages
const routes = [
  {
    path: "/",
    method: "GET",
    handler: pages.index,
  },
  {
    path: "/gallery",
    method: "GET",
    handler: pages.gallery,
  },
  {
    path: "/gallery-add",
    method: "GET",
    handler: pages.galleryAdd,
  },
  {
    path: "/prices",
    method: "GET",
    handler: pages.prices,
  },
  {
    path: "/projects",
    method: "GET",
    handler: pages.projects,
  },
  {
    path: "/about",
    method: "GET",
    handler: pages.about,
  },
  {
    path: "/legal/impressum",
    method: "GET",
    handler: pages.impressum,
  },
  {
    path: "/legal/privacy-policy",
    method: "GET",
    handler: pages.privacyPolicy,
  },
  {
    path: "/detailpage/art-raimond",
    method: "GET",
    handler: pages.artRaimond,
  },
  {
    path: "/detailpage/art-stargaze",
    method: "GET",
    handler: pages.artStargaze,
  },
  {
    path: "/detailpage/price-headshot",
    method: "GET",
    handler: pages.priceHeadshot,
  },
  {
    path: "/detailpage/price-sticker",
    method: "GET",
    handler: pages.priceSticker,
  },
  {
    path: "/detailpage/project-fursuit",
    method: "GET",
    handler: pages.projectFursuit,
  },
  {
    path: "/detailpage/project-stickers",
    method: "GET",
    handler: pages.projectStickers,
  },
];

export const router = async (ctx) => {
  for (const route of routes) {
    if (
      ctx.method === route.method &&
      new URLPattern({ pathname: route.path }).test(ctx.url)
    ) {
      return route.handler(ctx);
    }
  }
  return pages.error404(ctx);
};
