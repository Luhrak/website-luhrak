import * as pages from "./pages/controller.js";
import * as gallery from "./gallery/controller.js";
import * as price from "./prices/controller.js";

const routes = [
  // Main pages
  {
    path: "/",
    method: "GET",
    handler: pages.index,
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

  // Gallery (specific ones before general id!)
  {
    path: "/gallery",
    method: "GET",
    handler: gallery.gallery,
  },
  {
    path: "/gallery/add",
    method: "GET",
    handler: gallery.addArtForm,
  },
  {
    path: "/gallery/add",
    method: "POST",
    handler: gallery.submitArtForm,
  },
  {
    path: "/gallery/:id",
    method: "GET",
    handler: gallery.artPiece,
  },
  {
    path: "/gallery-delete/:id",
    method: "POST", // Not actually using DELETE ok?
    handler: gallery.deleteArtPiece,
  },
  {
    path: "/gallery-edit/:id", // - instead of / suboptimal
    method: "GET",
    handler: gallery.editArtPiece,
  },
  {
    path: "/gallery-update/:id", // - instead of / suboptimal
    method: "POST", // Not actually using PUT/PATCH ok?
    handler: gallery.updateArtPiece,
  },

  // Prices
  {
    path: "/prices",
    method: "GET",
    handler: price.priceList,
  },
  {
    path: "/prices/add",
    method: "GET",
    handler: price.addPriceForm,
  },
  {
    path: "/prices/add",
    method: "POST",
    handler: price.submitPriceForm,
  },
  {
    path: "/prices/:id",
    method: "GET",
    handler: price.priceDetail,
  },
  {
    path: "/prices-delete/:id",
    method: "POST", // Not actually using DELETE ok?
    handler: price.deletePrice,
  },
  {
    path: "/prices-edit/:id", // - instead of / suboptimal
    method: "GET",
    handler: price.editPrice,
  },
  {
    path: "/prices-update/:id", // - instead of / suboptimal
    method: "POST", // Not actually using PUT/PATCH ok?
    handler: price.updatePrice,
  },

  // Legal pages
  {
    path: "/legalPages/impressum",
    method: "GET",
    handler: pages.impressum,
  },
  {
    path: "/legalPages/privacy-policy",
    method: "GET",
    handler: pages.privacyPolicy,
  },

  // Static Detailpages > Becomes project pages
  {
    path: "/detailPages/price-headshot", // Remove eventually
    method: "GET",
    handler: pages.priceHeadshot,
  },
  {
    path: "/detailPages/price-sticker", // Remove eventually
    method: "GET",
    handler: pages.priceSticker,
  },
  {
    path: "/detailPages/project-fursuit",
    method: "GET",
    handler: pages.projectFursuit,
  },
  {
    path: "/detailPages/project-stickers",
    method: "GET",
    handler: pages.projectStickers,
  },
];

export async function router(ctx) {
  // Match requests with known pages
  for (const route of routes) {
    const urlPattern = new URLPattern({ pathname: route.path });
    const match = urlPattern.exec(ctx.url);

    if (ctx.method === route.method && match) {
      ctx.entryId = match.pathname.groups.id; // id for detailpages
      return route.handler(ctx);
    }
  }
  return pages.error404(ctx);
}
