import Context from "./framework/context.js";
import { router } from "./router.js";
import { serveStatic } from "./middleware/serveStatic.js";
import { error500 } from "./middleware/error500.js";
import { logRequest } from "./middleware/logging.js";
import { getSession, saveSession } from "./middleware/session.js";

export async function handleRequest(request) {
  // Handles all requests the server gets using the renderer and middleware
  // try {
  let ctx = new Context(request);
  ctx = getSession(ctx);
  ctx = await router(ctx);
  ctx = await serveStatic(ctx);

  saveSession(ctx);
  logRequest(ctx);

  return ctx.extractResponse();
  // } catch {
  //   // If anything above went wrong, show custom error 500 page
  //   try {
  //     // Still try to get log the request for debuging
  //     logRequest(new Context(request));
  //   } catch {}

  //   return error500();
  // }
}
