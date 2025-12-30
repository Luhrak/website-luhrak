import { initConnection } from "./src/service/db.js";
import { handleRequest } from "./src/app.js";

const port = 8080;
const hostname = "127.0.0.1";
const DB_PATH = "./data/gallery.db";
const db = initConnection(DB_PATH);
Deno.serve({ port, hostname }, handleRequest);
// deno run --allow-net --allow-read --allow-write --watch server.js
// -allow-write=/PATH/TO/PROJECT/public/upload
