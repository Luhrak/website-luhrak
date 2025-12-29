import { serveDir } from "jsr:@std/http";
import * as path from "jsr:@std/path";

export const serveStatic = async (ctx) => {
  if (ctx.status !== 404) {
    return ctx;
  } else if (path.extname(ctx.url.pathname)) {
    const res = await serveDir(ctx.request, {
      fsRoot: "./public",
      quiet: true,
      showDirListing: false,
      showDotfiles: false,
      showIndex: false,
    });
    if (res.status !== 404) {
      ctx.body = res.body;
      ctx.headers = res.headers;
      ctx.status = res.status;
    }
  }
  return ctx;
};
