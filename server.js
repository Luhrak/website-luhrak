import { handleRequest } from "./src/app.js";

const port = 8080;
Deno.serve({ port: port }, handleRequest);
// deno run --allow-net --allow-read --allow-write --watch server.js
