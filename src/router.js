import * as pages from "./pages/controller.js";
import * as gallery from "./gallery/controller.js";
import * as price from "./prices/controller.js";
import * as contact from "./contact/controller.js";
import * as account from "./accounts/controller.js";
import { getPermissionById } from "./accounts/model.js";

const routes = [
  // specific ones before general ones like :id
  // or it will falsely match request of /gallery with /gallery/id

  // TODO: Some routes using sepertator - instead of / which is not ideal

  // Main routes
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

  // Misc routes
  {
    path: "/impressum",
    method: "GET",
    handler: pages.impressum,
  },
  {
    path: "/privacy-policy",
    method: "GET",
    handler: pages.privacyPolicy,
  },

  // Project routes
  {
    path: "/projects-fursuit",
    method: "GET",
    handler: pages.projectFursuit,
  },
  {
    path: "/projects-stickers",
    method: "GET",
    handler: pages.projectStickers,
  },

  // Gallery routes
  {
    path: "/gallery",
    method: "GET",
    handler: gallery.gallery,
  },
  {
    path: "/gallery/add",
    method: "GET",
    requiredPermissions: ["admin", "moderator"],
    handler: gallery.addArtForm,
  },
  {
    path: "/gallery/add",
    method: "POST",
    requiredPermissions: ["admin", "moderator"],
    handler: gallery.submitArtForm,
  },
  {
    path: "/gallery/:id",
    method: "GET",
    handler: gallery.artPiece,
  },
  {
    path: "/gallery-delete/:id",
    method: "POST",
    requiredPermissions: ["admin", "moderator"],
    handler: gallery.deleteArtPiece,
  },
  {
    path: "/gallery-edit/:id",
    method: "GET",
    requiredPermissions: ["admin", "moderator"],
    handler: gallery.editArtPiece,
  },
  {
    path: "/gallery-update/:id",
    method: "POST",
    requiredPermissions: ["admin", "moderator"],
    handler: gallery.updateArtPiece,
  },

  // Prices routes
  {
    path: "/prices",
    method: "GET",
    handler: price.priceList,
  },
  {
    path: "/prices/add",
    method: "GET",
    requiredPermissions: ["admin", "moderator"],
    handler: price.addPriceForm,
  },
  {
    path: "/prices/add",
    method: "POST",
    requiredPermissions: ["admin", "moderator"],
    handler: price.submitPriceForm,
  },
  {
    path: "/prices/:id",
    method: "GET",
    handler: price.priceDetail,
  },
  {
    path: "/prices-delete/:id",
    method: "POST",
    requiredPermissions: ["admin", "moderator"],
    handler: price.deletePrice,
  },
  {
    path: "/prices-edit/:id",
    method: "GET",
    requiredPermissions: ["admin", "moderator"],
    handler: price.editPrice,
  },
  {
    path: "/prices-update/:id",
    method: "POST",
    requiredPermissions: ["admin", "moderator"],
    handler: price.updatePrice,
  },

  // Accounts routes
  {
    path: "/login",
    method: "GET",
    requiredPermissions: ["none"],
    handler: account.login,
  },
  {
    path: "/signup",
    method: "GET",
    requiredPermissions: ["none"],
    handler: account.signup,
  },
  {
    path: "/login",
    method: "POST",
    requiredPermissions: ["none"],
    handler: account.confirmLogin,
  },
  {
    path: "/signup",
    method: "POST",
    requiredPermissions: ["none"],
    handler: account.confirmSignup,
  },
  {
    path: "/logout",
    method: "GET",
    requiredPermissions: ["guest", "admin", "moderator"],
    handler: account.logout,
  },

  // Contact routes
  {
    path: "/contact/add",
    method: "POST",
    handler: contact.submitContactForm,
  },
  {
    path: "/messages",
    method: "GET",
    handler: contact.messageList,
  },
  {
    path: "/messages",
    method: "GET",
    handler: contact.messageList,
  },
  {
    path: "/messages-read/:id",
    method: "POST",
    handler: contact.markMessageRead,
  },

  {
    path: "/messages-delete/:id",
    method: "POST",
    handler: contact.deleteMessage,
  },
];

export async function router(ctx) {
  // Match requests with known routes and uses their handler
  for (const route of routes) {
    // URL Pattern & Method
    const urlPattern = new URLPattern({ pathname: route.path });
    const match = urlPattern.exec(ctx.url);
    if (ctx.method === route.method && match) {
      // Check rather permissions are requried
      if (!("requiredPermissions" in route)) {
        return proceedRouteHandler(ctx, match, route);
      }
      return checkUserPermission(ctx, match, route);
    }
  }
  return pages.error404(ctx);
}

function checkUserPermission(ctx, match, route) {
  const userPermission = ctx.session.account
    ? getPermissionById(ctx.session.account)
    : "none";
  if (
    userPermission &&
    Object.values(route.requiredPermissions).includes(userPermission)
  ) {
    return proceedRouteHandler(ctx, match, route);
  }
  return pages.error403(ctx);
}

function proceedRouteHandler(ctx, match, route) {
  ctx.entryId = match.pathname.groups.id; // id for detailpages
  return route.handler(ctx);
}
