import * as model from "./model.js";
import { render } from "../../service/render.js";

export async function login(ctx) {
  // Handling of page with login formular
  ctx.body = await render("login.html", ctx);
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export async function signup(ctx) {
  // Handling of page with signin formular (new account)
  ctx.body = await render("login.html", ctx, { signup: "Sign up" });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export function logout(ctx) {
  // Handling of logging out of current account
  delete ctx.session.content.account;
  ctx.session.content.flash = "You are now logged out";
  ctx.status = 303;
  ctx.headers.set("Location", `/`);
  return ctx;
}
