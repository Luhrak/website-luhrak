import { Application } from "@oak/oak";
import router from "./router.js";
import { serveStaticFile } from "./middleware/serveStaticFile.js";

const app = new Application();
app.use(serveStaticFile);
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
