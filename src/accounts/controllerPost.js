import * as model from "./model.js";
import { render } from "../service/render.js";

export async function loginConfirm(ctx) {
  // Read form data
  const form = await ctx.request.formData();
  const formData = Object.fromEntries(form.entries());

  // Validation
  const errors = {};
  if (!formData.username) errors.username = "Username is required";
  if (!formData.password) errors.password = "Password is required";
  if (Object.keys(errors).length > 0) {
    loginWithData(ctx, formData, errors);
  } else {
    const account = model.match({
      username: formData.username,
      password: formData.password,
    });
    if (account === undefined) {
      errors.username =
        "No account with this username and password combination found";
      loginWithData(ctx, formData, errors);
    } else {
      // Login
      ctx.session.account = account.id;
      ctx.session.flash = "You are now logged in as " + formData.username;

      // Redirect
      ctx.status = 303;
      ctx.headers.set("Location", `/`);
      return ctx;
    }
  }
  return ctx;
}

async function loginWithData(ctx, formData, errors) {
  // no redirect or export cuz only used in submit / update
  ctx.body = await render("login.html", ctx, {
    formData: formData,
    formErrors: errors,
  });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
}

export async function signupConfirm(ctx) {
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
    signupWithData(ctx, formData, errors);
  } else {
    // Save to db
    const newEntry = model.add({
      username: formData.username,
      password: formData.password,
      permission: "guest",
    });

    // Login
    ctx.session.account = newEntry;
    ctx.session.flash = "Account created and logged in as " + formData.username;

    // Redirect to uploaded detailpage (ctx.body not needed for redirect)
    ctx.status = 303;
    ctx.headers.set("Location", `/`);
  }
  return ctx;
}

async function signupWithData(ctx, formData, errors) {
  // no redirect or export cuz only used in submit / update
  ctx.body = await render("login.html", ctx, {
    signup: "Sign up",
    formData: formData,
    formErrors: errors,
  });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
}

function isValidatePassword(password) {
  // https://www.geeksforgeeks.org/javascript/javascript-program-to-validate-password-using-regular-expressions/
  let regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;
  return regex.test(password);
}
