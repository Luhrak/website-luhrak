import { connection } from "../service/db.js";

// Create table
export function create() {
  const db = connection();
  const stmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS "price" (
      "id" INTEGER NOT NULL UNIQUE,
      "artfile" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "type" TEXT NOT NULL,
      "date" TEXT NOT NULL,
      "description" TEXT,
      "additions" TEXT,
      PRIMARY KEY("id" AUTOINCREMENT)
    )
  `);
  return stmt.all();
}

// Only for overview (images)
export function listVisualOnly() {
  const db = connection();
  return db.prepare(`
    SELECT id, artfile, title FROM price
  `).all();
}

// Full list
export function list() {
  const db = connection();
  return db.prepare(`
    SELECT id, artfile, title, type, date, description, additions
    FROM price
  `).all();
}

// Single entry
export function get(id) {
  const db = connection();
  return db.prepare(`
    SELECT id, artfile, title, type, date, description, additions
    FROM price
    WHERE id = ?
  `).get(id);
}

// Add new entry
export function add({ artfile, title, type, date, description, additions }) {
  const db = connection();
  const result = db.prepare(`
    INSERT INTO price (artfile, title, type, date, description, additions)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(artfile, title, type, date, description, additions);

  return result.lastInsertRowid;
}

// Update entry
export function update(id, { artfile, title, type, description, additions }) {
  const db = connection();
  db.prepare(`
    UPDATE price
    SET artfile = ?, title = ?, type = ?, date = ?, description = ?, additions = ?
    WHERE id = ?
  `).run(artfile, title, type, date, description, additions, id);

  return id;
}

// Delete entry
export function del(id) {
  const db = connection();
  return db.prepare(`
    DELETE FROM price WHERE id = ?
  `).run(id);
}