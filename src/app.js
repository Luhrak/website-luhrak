import Context from "./framework/context.js";
import { router } from "./router.js";
import { serveStatic } from "./middleware/serveStatic.js";
import { error500 } from "./middleware/error500.js";

export async function handleRequest(request) {
  // Custom 500 page with try catch commented out while working on project so we can get error messages in terminal

  // try {
  let ctx = new Context(request);
  ctx = await router(ctx);
  ctx = await serveStatic(ctx);
  return ctx.extractResponse();
  // } catch {
  //   // If anything above went wrong, show custom error 500 page
  //   return error500();
  // }
}
