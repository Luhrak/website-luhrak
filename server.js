import app from "./src/app.js";

const port = 8080;
console.log(`Server is running on http://localhost:${port}`);
await app.listen({ port });
