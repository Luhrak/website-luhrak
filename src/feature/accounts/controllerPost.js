import * as model from "./model.js";
import { render } from "../../service/render.js";
import { encodeBase64 } from "jsr:@std/encoding/base64";
import { hash, verify } from "@stdext/crypto/hash";
import { rerenderWithErrors } from "../../service/rerenderWithErrors.js";

export async function loginConfirm(ctx) {
  // Handling when submiting the login formular
  // Read form data
  const form = await ctx.request.formData();
  const formData = Object.fromEntries(form.entries());

  // Validation
  const errors = {};
  if (!formData.username) errors.username = "Username is required";
  if (!formData.password) errors.password = "Password is required";
  if (Object.keys(errors).length > 0 || formData.partial) {
    ctx = rerenderWithErrors(ctx, formData, errors, "login.html");
  } else {
    // First get accounts that matches the username to get the salt (without no password check)
    const account = (await model.getByUsername(formData.username)) ?? {
      // Realistic dummy data so that even if no entry found theres no errors and it still takes the same amount of time
      id: 0,
      username: "dummy",
      salt: "IfGJRwmR2FQ/JJEVb47UMfyn6BUctw==",
      password:
        "$argon2id$v=19$m=19456,t=2,p=1$IEti5kG1ANI7S9cmN+LP6g$vVnIL3+dX99l2I3lEZWFRNDlNKYqBHzXLyit+DGF+gM",
      permission: "guest",
    };

    // Now we can verify the password with the salt
    if (
      verifyPassword(account.salt, formData.password, account.password) &&
      account.username !== "dummy" // ofc dont log in if no account was found
    ) {
      // Login
      ctx.session.content.account = account.id;
      ctx.session.content.flash =
        "You are now logged in as " + account.username;

      // Redirect
      ctx.status = 303;
      ctx.headers.set("Location", `/`);
      return ctx;
    }

    errors.username =
      "No account with this username and password combination found";
    ctx = rerenderWithErrors(ctx, formData, errors, "login.html");
  }
  return ctx;
}

export async function signupConfirm(ctx) {
  // Handling when submiting the signin formular
  // Read form data
  const form = await ctx.request.formData();
  const formData = Object.fromEntries(form.entries());

  // Validation
  const errors = {};
  if (!formData.username) errors.username = "Username is required";
  if (formData.username && isUsernameTaken(formData.username))
    "Username already taken.";
  if (!formData.password) errors.password = "Password is required";
  if (formData.password && !isValidPassword(formData.password))
    errors.password =
      "Invalid password (Must be at leat 8 characters with a lowercase, uppcase, number and special character)";
  if (formData.password !== formData.passwordConfirm)
    errors.passwordConfirm = "Passwords dont match";

  if (Object.keys(errors).length > 0 || formData.partial) {
    await signupWithData(ctx, formData, errors);
  } else {
    // Password hashing
    const salt = createSalt();
    const hashedPassword = hashPassword(salt, formData.password);

    // Save to db
    const newEntry = await model.add({
      username: formData.username,
      password: hashedPassword,
      salt: salt,
      permission: "guest",
    });

    // Login
    ctx.session.content.account = newEntry;
    ctx.session.content.flash =
      "Account created and logged in as " + formData.username;

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

export async function changePasswordConfirm(ctx) {
  // Handling when changing password
  // Read form data
  const form = await ctx.request.formData();
  const formData = Object.fromEntries(form.entries());

  // Validation
  const errors = {};
  if (!formData.oldPassword) errors.oldPassword = "Old password is required";
  if (!formData.newPassword) errors.newPassword = "New password is required";
  if (!formData.passwordConfirm)
    errors.passwordConfirm = "Repeat password is required";
  if (formData.newPassword !== formData.passwordConfirm)
    errors.passwordConfirm = "Passwords dont match";

  if (Object.keys(errors).length > 0 || formData.partial) {
    ctx = rerenderWithErrors(ctx, formData, errors, "change-password.html");
  } else {
    // First get accounts that matches the username to get the salt (without no password check)
    const accountId = ctx.session.content.account;
    const account = await model.get(accountId);

    // Now we can verify the password with the salt
    if (!verifyPassword(account.salt, formData.oldPassword, account.password)) {
      errors.oldPassword = "Incorrect old password.";
      ctx = rerenderWithErrors(ctx, formData, errors, "change-password.html");
    }
    const newSalt = createSalt();
    const newPassword = hashPassword(newSalt, formData.newPassword);
    model.updatePassword(account.id, { password: newPassword, salt: newSalt });

    ctx.session.content.flash = "Password changed successfully";

    // Redirect
    ctx.status = 303;
    ctx.headers.set("Location", `/`);
    return ctx;
  }
  return ctx;
}

function isUsernameTaken(username) {
  const result = model.getByUsername(username);
  return result ? true : false;
}

function isValidPassword(password) {
  // https://www.geeksforgeeks.org/javascript/javascript-program-to-validate-password-using-regular-expressions/
  let regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-_@.#$!%*?&])[A-Za-z\d-_@.#$!%*?&]{8,25}$/;
  return regex.test(password);
}

export const createSalt = () => {
  // Creates a string with 22 random characters to use as password salt
  const array = new Uint8Array(22);
  crypto.getRandomValues(array);
  return encodeBase64(array);
};

export const hashPassword = (salt, password) => hash("argon2", salt + password);

const verifyPassword = (salt, providedPassword, accountPassword) =>
  verify("argon2", salt + providedPassword, accountPassword);
