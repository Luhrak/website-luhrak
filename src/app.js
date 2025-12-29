import Context from "./framework/context.js";
import { router } from "./router.js";
import { serveStatic } from "./framework/middleware/serveStatic.js";

export const handleRequest = async (request) => {
  let ctx = new Context(request);
  ctx = await router(ctx);
  ctx = await serveStatic(ctx);
  return ctx.extractResponse();
};
