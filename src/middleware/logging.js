import { connection } from "../service/db.js";

export async function logRequest(ctx) {
  // Filtering out static or they would clutter the log a lot
  if (!ctx.serveStatic) {
    const logEntry = {
      time: ctx.logTime.toString(),
      processTime: new Date() - ctx.logTime,
      method: ctx.method,
      status: ctx.status,
      url: ctx.url.href,
    };
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
      PRIMARY KEY("id" AUTOINCREMENT)
    )
    `);
  return stmt.all();
}

// Adding a new entry
export function add({ time, processTime, method, status, url }) {
  const db = connection();
  const stmt = db.prepare(`
    INSERT INTO requestLog (time, processTime, method, status, url)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(time, processTime, method, status, url);
  return result.lastInsertRowid;
}
