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
    ctx.status = 400;
    return ctx;
  }

  const id = model.add({
    name: formData.name,
    email: formData.email,
    subject: formData.subject,
    message: formData.message,
  });


  console.log("📨 New contact saved:", {
    id,
    name: formData.name,
    email: formData.email,
    subject: formData.subject,
    message: formData.message,
  });




  

  ctx.status = 303;
  ctx.headers.set("Location", "/#contact-about");
  return ctx;
}

export async function messageList(ctx) {
  const messages = model.list(); // list() holt alle Nachrichten aus DB

  ctx.body = await render("messages.html", { messages });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}