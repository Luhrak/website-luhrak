import { connection } from "../service/db.js";

// Create table
export function create() {
  const db = connection();
  const stmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS "prices" (
      "id" INTEGER NOT NULL UNIQUE,
      "previewfile" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "additions" TEXT,
      PRIMARY KEY("id" AUTOINCREMENT)
    )
  `);
  return stmt.all();
}

// Only for overview (images)
export function listVisualOnly() {
  const db = connection();
  return db
    .prepare(
      `
    SELECT id, previewfile, title FROM prices
    `
    )
    .all();
}

// Full list
export function list() {
  const db = connection();
  return db
    .prepare(
      `
    SELECT id, previewfile, title, description, additions
    FROM prices
  `
    )
    .all();
}

// Single entry
export function get(id) {
  const db = connection();
  return db
    .prepare(
      `
    SELECT id, previewfile, title, description, additions
    FROM prices
    WHERE id = ?
  `
    )
    .get(id);
}

// Add new entry
export function add({ previewfile, title, description, additions }) {
  const db = connection();
  const result = db
    .prepare(
      `
    INSERT INTO prices (previewfile, title, description, additions)
    VALUES (?, ?, ?, ?)
  `
    )
    .run(previewfile, title, description, additions);

  return result.lastInsertRowid;
}

// Update entry
export function update(id, { previewfile, title, description, additions }) {
   db = connection();
  const stmt = db.prepare(
    `
    UPDATE prices
    SET previewfile = ?, title = ?, description = ?, additions = ?
    WHERE id = ?
  `
  );
  stmt.run(previewfile, title, description, additions, id);

  return id;
}

// Delete entry
export function del(id) {
  const db = connection();
  return db
    .prepare(
      `
    DELETE FROM prices WHERE id = ?
  `
    )
    .run(id);
}
