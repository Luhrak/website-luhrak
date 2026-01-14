import * as model from "./model.js";
import { render } from "../service/render.js";

export async function submitContactForm(ctx) {
  const form = await ctx.request.formData();
  const formData = Object.fromEntries(form.entries());

  const errors = {};
  if (!formData.name) errors.name = "Name is required";
  if (!formData.email) errors.email = "Email is required";
  if (!formData.message) errors.message = "Message is required";

  if (Object.keys(errors).length > 0) {
    ctx.body = await render("contact.html", {
      formData,
      formErrors: errors,
    });
    ctx.headers.set("content-type", "text/html");
    ctx.status = 200;
    return ctx;
  }

  const id = model.add({
    name: formData.name,
    email: formData.email,
    subject: formData.subject,
    message: formData.message,
    is_new: 1,
  });

  ctx.status = 303;
  ctx.headers.set("Location", "/#contact-about");
  return ctx;
}

export async function messageList(ctx) {
  const newMessages = model.listNew(); // is_new = 1
  const readMessages = model.listRead(); // is_new = 0

  ctx.body = await render("messages.html", {
    messages: {
      new: newMessages,
      read: readMessages,
    },
  });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}
export async function markMessageRead(ctx) {
  const id = ctx.entryId;
  model.markAsRead(id);

  ctx.status = 303;
  ctx.headers.set("Location", "/messages");
  return ctx;
}
export async function deleteMessage(ctx) {
  const id = ctx.entryId;
  model.del(id);

  ctx.status = 303;
  ctx.headers.set("Location", "/messages");
  return ctx;
}
