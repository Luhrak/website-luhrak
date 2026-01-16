import { initConnection } from "./src/service/db.js";
import { handleRequest } from "./src/app.js";
import { createSessionStore } from "./src/service/sessionStore.js";
import { initDbTables } from "./src/middleware/initDbTables.js";

const port = 8080;
const hostname = "127.0.0.1";
const DB_PATH = "./data/data.db";

createSessionStore();
const db = initConnection(DB_PATH);
initDbTables(); 

Deno.serve({ port, hostname }, handleRequest);
// deno run --allow-net --allow-read --allow-write --watch server.js
// deno run --allow-net --allow-read --allow-write --allow-env --unstable-temporal server.js
