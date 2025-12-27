import * as path from "jsr:@std/path";
import nunjucks from "npm:nunjucks@3.2.4";

const templPath = "./src/templates";

nunjucks.configure(templPath, {
  autoescape: true, // on by standard
  noCache: true, // recompile everytime (dev mode)
  watch: false, // only for live update
});

export function render(viewName, context = {}) {
  return nunjucks.render(viewName, context);
}
