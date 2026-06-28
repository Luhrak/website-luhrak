import Context from "./framework/context.js";
import { router } from "./router.js";
import { serveStatic } from "./middleware/serveStatic.js";
import { error500 } from "./middleware/error500.js";
import { logRequest } from "./middleware/logging.js";
import { getSession, saveSession } from "./middleware/session.js";
import { IsDeployed } from "./service/development.js";

export async function handleRequest(request) {
  // Handles all requests the server gets using the renderer and middleware
  //try {
  let ctx = new Context(request);
  ctx = getSession(ctx);
  ctx = await router(ctx);
  ctx = await serveStatic(ctx);

  saveSession(ctx);
  await logRequest(ctx);

  return ctx.extractResponse();
  /*} catch (error) {
    console.error(
      // https://docs.deno.com/api/deno/io/#Deno.inspect
      Deno.inspect(error, {
        colors: true,
        compact: false,
        depth: Infinity,
        showHidden: true,
      }),
    );
    return error500();
  }*/
}
