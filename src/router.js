import * as pages from "./pages/controller.js";
import * as galleryGet from "./feature/gallery/controllerGet.js";
import * as galleryPost from "./feature/gallery/controllerPost.js";
import * as priceGet from "./feature/prices/controllerGet.js";
import * as pricePost from "./feature/prices/controllerPost.js";
import * as accountGet from "./feature/accounts/controllerGet.js";
import * as accountPost from "./feature/accounts/controllerPost.js";
import * as contact from "./feature/contact/controller.js";
import { getPermissionById } from "./feature/accounts/model.js";

const routes = [
  // specific ones before general ones like :id
  // or it will falsely match request of /gallery with /gallery/id

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
    handler: galleryGet.gallery,
  },
  {
    path: "/gallery/add",
    method: "GET",
    requiredPermissions: ["admin", "moderator"],
    handler: galleryGet.galleryAdd,
  },
  {
    path: "/gallery/add",
    method: "POST",
    requiredPermissions: ["admin", "moderator"],
    handler: galleryPost.gallerySubmit,
  },
  {
    path: "/gallery/:id",
    method: "GET",
    handler: galleryGet.galleryDetail,
  },
  {
    path: "/gallery-delete/:id",
    method: "POST",
    requiredPermissions: ["admin", "moderator"],
    handler: galleryPost.galleryDelete,
  },
  {
    path: "/gallery-edit/:id",
    method: "GET",
    requiredPermissions: ["admin", "moderator"],
    handler: galleryGet.galleryEdit,
  },
  {
    path: "/gallery-update/:id",
    method: "POST",
    requiredPermissions: ["admin", "moderator"],
    handler: galleryPost.galleryUpdate,
  },

  // Prices routes
  {
    path: "/prices",
    method: "GET",
    handler: priceGet.prices,
  },
  {
    path: "/prices/add",
    method: "GET",
    requiredPermissions: ["admin", "moderator"],
    handler: priceGet.pricesAdd,
  },
  {
    path: "/prices/add",
    method: "POST",
    requiredPermissions: ["admin", "moderator"],
    handler: pricePost.pricesSubmit,
  },
  {
    path: "/prices/:id",
    method: "GET",
    handler: priceGet.pricesDetail,
  },
  {
    path: "/prices-delete/:id",
    method: "POST",
    requiredPermissions: ["admin", "moderator"],
    handler: pricePost.pricesDelete,
  },
  {
    path: "/prices-edit/:id",
    method: "GET",
    requiredPermissions: ["admin", "moderator"],
    handler: priceGet.pricesEdit,
  },
  {
    path: "/prices-update/:id",
    method: "POST",
    requiredPermissions: ["admin", "moderator"],
    handler: pricePost.pricesUpdate,
  },

  // Accounts routes
  {
    path: "/login",
    method: "GET",
    requiredPermissions: ["none"],
    handler: accountGet.login,
  },
  {
    path: "/login",
    method: "POST",
    requiredPermissions: ["none"],
    handler: accountPost.loginConfirm,
  },
  {
    path: "/logout",
    method: "GET",
    requiredPermissions: ["guest", "admin", "moderator"],
    handler: accountGet.logout,
  },
  {
    path: "/change-password",
    method: "GET",
    requiredPermissions: ["guest", "admin", "moderator"],
    handler: accountGet.changePassword,
  },
  {
    path: "/change-password",
    method: "POST",
    requiredPermissions: ["guest", "admin", "moderator"],
    handler: accountPost.changePasswordConfirm,
  },
  // {
  //   path: "/signup",
  //   method: "GET",
  //   requiredPermissions: ["none"],
  //   handler: accountGet.signup,
  // },
  // {
  //   path: "/signup",
  //   method: "POST",
  //   requiredPermissions: ["none"],
  //   handler: accountPost.signupConfirm,
  // },

  // Contact routes
  {
    path: "/contact/add",
    method: "POST",
    handler: contact.messagesSubmit,
  },
  {
    path: "/messages",
    method: "GET",
    requiredPermissions: ["admin", "moderator"],
    handler: contact.messages,
  },
  {
    path: "/messages",
    method: "GET",
    handler: contact.messages,
  },
  {
    path: "/messages-read/:id",
    method: "POST",
    handler: contact.messagesMarkRead,
  },

  {
    path: "/messages-delete/:id",
    method: "POST",
    handler: contact.messagesDelete,
  },
];

export async function router(ctx) {
  // Matchs requests with known routes and uses their handler
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

async function checkUserPermission(ctx, match, route) {
  // Checks rather the user has permission for this route
  const userPermission = ctx.session.content.account
    ? await getPermissionById(ctx.session.content.account)
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
  // Use the handler of the route
  ctx.entryId = match.pathname.groups.id; // id for detailpages
  return route.handler(ctx);
}
