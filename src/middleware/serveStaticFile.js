import { send } from "@oak/oak";
import { join, resolve } from "jsr:@std/path";

const staticDir = join(Deno.cwd(), "public");
const knownPaths = ["/styles", "/pictures", "/js"];

export const serveStaticFile = async (ctx, next) => {
  // Check if the request path starts with a static Path
  const pathname = ctx.request.url.pathname;
  if (knownPaths.some((path) => pathname.startsWith(path))) {
    // static response
    await send(ctx, ctx.request.url.pathname, { root: staticDir });
  } else {
    await next();
  }
};
