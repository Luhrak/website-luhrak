import * as model from "./model.js";
import { render } from "../../service/render.js";
import { isEmailValid } from "../../service/email.js";

// Get Requests:

export async function messages(ctx) {
  // Handling of page with messages overview
  const newMessages = await model.listNew(); // is_new = 1
  const readMessages = await model.listRead(); // is_new = 0
  ctx.body = await render("messages.html", ctx, {
    messages: {
      new: newMessages,
      read: readMessages,
    },
  });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}

// Post Requests:

export async function messagesMarkRead(ctx) {
  // Marks the message as read
  const id = ctx.entryId;
  await model.markAsRead(id);
  ctx.session.content.flash = "Message marked as read";
  ctx.status = 303;
  ctx.headers.set("Location", "/messages");
  return ctx;
}

export async function messagesDelete(ctx) {
  // Delets the message and redirect to messages page
  const id = ctx.entryId;
  await model.remove(id);
  ctx.session.content.flash = "Message deleted";
  ctx.status = 303;
  ctx.headers.set("Location", "/messages");
  return ctx;
}

export async function messagesSubmit(ctx) {
  // Handling when submiting the contact formular
  // Read form data
  const form = await ctx.request.formData();
  const formData = Object.fromEntries(form.entries());

  // Validation
  const errors = {};
  if (!formData.name) errors.name = "Name is required";
  if (!formData.subject) errors.subject = "Subject is required";
  if (!formData.email) errors.email = "Email is required";
  if (formData.email && !isEmailValid(formData.email))
    errors.email = "Must be a valid email";
  if (!formData.message) errors.message = "Message is required";

  if (Object.keys(errors).length > 0) {
    await messageAddWithData(ctx, formData, errors);
  } else {
    // Save to db
    const id = await model.add({
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      is_new: 1,
    });

    // Redirect to uploaded detailpage (ctx.body not needed for redirect)
    ctx.session.content.flash =
      'Message "' + formData.subject + '" has been send';
    ctx.status = 303;
    ctx.headers.set("Location", "/about#contact-about");
  }
  return ctx;
}

async function messageAddWithData(ctx, formData, errors) {
  // When there is an error, this sends back to the new contact form page with the errors
  ctx.body = await render("about.html", ctx, {
    formData: formData,
    formErrors: errors,
  });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
}
