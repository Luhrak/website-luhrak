import * as path from "jsr:@std/path";
import nunjucks from "npm:nunjucks@3.2.4";

const templPath = "./templates";

nunjucks.configure(templPath, {
  autoescape: true, // on by standard
  noCache: true, // recompile everytime (dev mode)
  watch: false, // only for live update
});

export async function render(viewName, context = {}) {
  return await nunjucks.render(viewName, context);
}
