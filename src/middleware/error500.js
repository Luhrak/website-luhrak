import * as path from "jsr:@std/path";

export async function error500() {
  // Without using any other code like service/render show a basic site with the error
  // In case serveStatic still functions it also has its css, images and js
  const filepath = path.join(
    Deno.cwd(),
    "templates",
    "errorPages",
    "error500.html"
  );
  const header = new Headers();
  header.set("content-type", "text/html");

  return new Response(await Deno.readTextFile(filepath), {
    status: 500,
    headers: header,
  });
}
