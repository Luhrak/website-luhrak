import { connection } from "../service/db.js";

export function create() {
  // Creates gallery table if not exist
  const db = connection();
  const stmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS "gallery" (
      "id"	INTEGER NOT NULL UNIQUE,
      "artfile"	TEXT NOT NULL,
      "title"	TEXT NOT NULL,
      "type"	TEXT NOT NULL,
      "date"	TEXT NOT NULL,
      "alt"	TEXT DEFAULT 'An artpiece',
      "description"	TEXT,
      PRIMARY KEY("id" AUTOINCREMENT)
    )
    `);
  return stmt.all();
}

export function list() {
  // Gets a list with all entries
  const db = connection();
  const stmt = db.prepare(`
    SELECT id, artfile, title, type, date, alt, description 
    FROM gallery
    `);
  return stmt.all();
}

export function listMinimal() {
  // Gets a list with all entries but only columns needed for the gallery tab
  const db = connection();
  const stmt = db.prepare(`
    SELECT id, artfile, alt  
    FROM gallery
    ORDER BY id DESC
  `);
  return stmt.all();
}

export function get(id) {
  // Gets one entry with all columns via id
  const db = connection();
  const stmt = db.prepare(`
    SELECT id, artfile, title, type, date, alt, description 
    FROM gallery
    WHERE id = ?
  `);
  return stmt.get(id);
}

export function add({ artfile, title, type, date, alt, description }) {
  // Adds a new entry
  const db = connection();
  const stmt = db.prepare(`
    INSERT INTO gallery (artfile, title, type, date, alt, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(artfile, title, type, date, alt, description);
  return result.lastInsertRowid;
}

export function remove(id) {
  // delets one entry via id
  const db = connection();
  const stmt = db.prepare(`
    DELETE 
    FROM gallery
    WHERE id = ?
  `);
  return stmt.get(id);
}

export function update(id, { artfile, title, type, date, alt, description }) {
  // Updates an existing entry
  const db = connection();
  const stmt = db.prepare(`
    UPDATE gallery
    SET artfile = ?, title = ?, type = ?, date = ?, alt = ?, description = ?
    WHERE id = ?
  `);
  stmt.run(artfile, title, type, date, alt, description, id);
  return id;
}
