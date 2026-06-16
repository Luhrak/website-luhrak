import { createSessionStore } from "./src/service/sessionStore.js";
import { initConnection } from "./src/service/db.js";
import { initDbTables } from "./src/middleware/initDbTables.js";
import { handleRequest } from "./src/app.js";

const port = 8080;
const hostname = "127.0.0.1";

createSessionStore();
const db = await initConnection({
  hostname: Deno.env.get("PGHOST"),
  port: Deno.env.get("PGPORT"),
  user: Deno.env.get("PGUSER"),
  password: Deno.env.get("PGPASSWORD"),
  database: "postgres",
});
initDbTables();

Deno.serve({ port, hostname }, handleRequest);
