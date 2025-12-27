import { Application } from "@oak/oak";
import router from "./router.js";
import { serveStaticFile } from "./middleware/serveStaticFile.js";

const app = new Application();
// Middleware
app.use(serveStaticFile);
// Routing
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
