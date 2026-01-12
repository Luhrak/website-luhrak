import { connection } from "../service/db.js";

export async function logRequest(ctx) {
  // Filter out images or they would clutter the log a lot
  if (!ctx.serveStatic) {
    const logEntry = {
      time: ctx.logTime.toString(),
      processTime: new Date().getMilliseconds() - ctx.logTime.getMilliseconds(),
      method: ctx.method,
      status: ctx.status,
      url: ctx.url.href,
      origin: ctx.url.origin,
    };
    console.log(logEntry);
    add(logEntry);
  }
}

// Create gallery table if not exist
export function create() {
  const db = connection();
  const stmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS "requestLog" (
      "id"	        INTEGER NOT NULL UNIQUE,
      "time"	    TEXT NOT NULL,
      "processTime"	INTEGER NOT NULL,
      "method"	    TEXT NOT NULL,
      "status"	    INTEGER NOT NULL,
      "url"	        TEXT NOT NULL,
      "origin"	    TEXT NOT NULL,
      PRIMARY KEY("id" AUTOINCREMENT)
    )
    `);
  return stmt.all();
}

// Adding a new entry
export function add({ time, processTime, method, status, url, origin }) {
  const db = connection();
  const stmt = db.prepare(`
    INSERT INTO requestLog (time, processTime, method, status, url, origin)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(time, processTime, method, status, url, origin);
  return result.lastInsertRowid;
}
