import * as path from "jsr:@std/path";
import nunjucks from "npm:nunjucks@3.2.4";
import { getPermissionById } from "../accounts/model.js";

const templPath = "./templates";

nunjucks.configure(templPath, {
  autoescape: true, // on by standard
  noCache: true, // recompile everytime (dev mode)
  watch: false, // only for live update
});

export async function render(viewName, ctx, variables = {}) {
  // This function adds flash message and permission check into render
  // so it doesnt have to be repeated over and over on every render
  variables = getFlash(ctx, variables);
  variables = getPermission(ctx, variables);
  // variables.permission = "true"; // DEBUG ONLY, REMOVE!

  // Then just nomal render via nunjucks
  return await nunjucks.render(viewName, variables);
}

function getFlash(ctx, variables) {
  if (ctx.session.flash) {
    variables.flash = ctx.session.flash;
    ctx.session.flashUsed = true;
  }
  return variables;
}

function getPermission(ctx, variables) {
  if (ctx.session.account) {
    const permission = getPermissionById(ctx.session.account);
    if (permission === "admin" || permission === "moderator") {
      variables.permission = "true";
      variables.loggedIn = "true";
    } else if (permission === "guest") {
      variables.loggedIn = "true";
    }
  }
  return variables;
}
