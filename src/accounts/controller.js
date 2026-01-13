import * as model from "./model.js";
import { render } from "../service/render.js";
import { Console } from "node:console";

export async function login(ctx) {
  ctx.body = await render("login.html");
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export async function signup(ctx) {
  ctx.body = await render("login.html", { signup: "Sign up" });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export async function confirmLogin(ctx) {
  ctx.body = await render("login.html");
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

export async function confirmSignup(ctx) {
  // Read form data
  const form = await ctx.request.formData();
  const formData = Object.fromEntries(form.entries());

  // Validation
  const errors = {};
  if (!formData.username) errors.username = "Username is required";
  if (!formData.password) errors.password = "Password is required";
  if (formData.password && !isValidatePassword(formData.password))
    errors.password =
      "Invalid password (Must be at leat 8 characters with a lowercase, uppcase, number and special character)";
  if (formData.password !== formData.passwordConfirm)
    errors.passwordConfirm = "Passwords dont match";

  if (Object.keys(errors).length > 0) {
    signupData(ctx, formData, errors);
  } else {
    // Save to db
    const newEntry = model.add({
      username: formData.username,
      password: formData.password,
      permission: "guest",
    });
    // Redirect to uploaded detailpage (ctx.body not needed for redirect)
    ctx.status = 303;
    ctx.headers.set("Location", `/`);
  }
  return ctx;
}

async function signupData(ctx, formData, errors) {
  // no redirect or export cuz only used in submit / update
  ctx.body = await render("login.html", {
    signup: "Sign up",
    formData: formData,
    formErrors: errors,
  });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 400;
}

function isValidatePassword(password) {
  // https://www.geeksforgeeks.org/javascript/javascript-program-to-validate-password-using-regular-expressions/
  let regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;
  return regex.test(password);
}
