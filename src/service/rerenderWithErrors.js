import { render } from "./render.js";

export async function rerenderWithErrors(ctx, formData, errors, html) {
  // Used for when there is an error in the submitted form
  // Sends back to the html page with the errors and data
  ctx.body = await render(html, ctx, {
    formData: formData,
    formErrors: errors,
  });
  ctx.headers.set("content-type", "text/html");
  ctx.status = 200;
  return ctx;
}
