import * as model from "./model.js";
import { render } from "../service/render.js";
import { encodeBase64 } from "jsr:@std/encoding/base64";
import { hash, verify } from "@stdext/crypto/hash";

const h = hash("argon2", "password");
verify("argon2", "password", h);

export async function loginConfirm(ctx) {
  // Handling when submiting the login formular
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
    // First get accounts that matches the username to get the salt (without no password check)
    const account = model.getByUsername(formData.username) ?? {
      // Realistic dummy data so that even if no entry found theres no errors and it still takes the same amount of time
      username: "dummy",
      salt: "IfGJRwmR2FQ/JJEVb47UMfyn6BUctw==",
      password:
        "$argon2id$v=19$m=19456,t=2,p=1$IEti5kG1ANI7S9cmN+LP6g$vVnIL3+dX99l2I3lEZWFRNDlNKYqBHzXLyit+DGF+gM",
      permission: "guest",
    };

    // Now we can verify the password with the salt
    if (
      verify("argon2", account.salt + formData.password, account.password) &&
      account.username !== "dummy" // ofc dont log in if no account was found
    ) {
      // Login
      ctx.session.account = account.id;
      ctx.session.flash = "You are now logged in as " + account.username;

      // Redirect
      ctx.status = 303;
      ctx.headers.set("Location", `/`);
      return ctx;
    }

    errors.username =
      "No account with this username and password combination found";
    loginWithData(ctx, formData, errors);
  }
  return ctx;
}

async function loginWithData(ctx, formData, errors) {
  // When there is an error, this sends back to the login page with the errors
  // no redirect or export cuz only used in submit / update
  ctx.body = await render("login.html", ctx, {
    formData: formData,
    formErrors: errors,
  });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
}

export async function signupConfirm(ctx) {
  // Handling when submiting the signin formular
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
    // Password hashing
    const salt = createSalt();
    const hashedPassword = hash("argon2", salt + formData.password);

    // Save to db
    const newEntry = model.add({
      username: formData.username,
      password: hashedPassword,
      salt: salt,
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
  // When there is an error, this sends back to the signup page with the errors
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

export const createSalt = () => {
  // Creates a string with 22 random characters to use as password salt
  const array = new Uint8Array(22);
  crypto.getRandomValues(array);
  return encodeBase64(array);
};
