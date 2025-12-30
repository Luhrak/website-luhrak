import { connection } from "../service/db.js";

// Create table if it doesnt exist
export function create() {
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

// Get a list with all entries
export function list() {
  const db = connection();
  const stmt = db.prepare(`
    SELECT id, artfile, title, type, date, alt, description 
    FROM gallery
    `);
  return stmt.all();
}

// Get a list with all entries but only getting the images for the gallery
export function listVisualOnly() {
  const db = connection();
  const stmt = db.prepare(`
    SELECT id, artfile, alt  
    FROM gallery
    `);
  return stmt.all();
}

// Get one entry with all attributes via id
export function get(id) {
  const db = connection();
  const stmt = db.prepare(`
    SELECT id, artfile, title, type, date, alt, description 
    FROM gallery
    WHERE id = ?
  `);
  return stmt.get(id);
}

// delete one entry via id
export function del(id) {
  const db = connection();
  const stmt = db.prepare(`
    DELETE 
    FROM gallery
    WHERE id = ?
  `);
  return stmt.get(id);
}

// Adding a new entry
export function add({ artfile, title, type, date, alt, description }) {
  const db = connection();
  const stmt = db.prepare(`
    INSERT INTO gallery (artfile, title, type, date, alt, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(artfile, title, type, date, alt, description);
  return result.lastInsertRowid;
}

// Edit an existing entry
export function update(id, { artfile, title, type, date, alt, description }) {
  const db = connection();
  const stmt = db.prepare(`
    UPDATE gallery
    SET artfile = ?, title = ?, type = ?, date = ?, alt = ?, description = ?
    WHERE id = ?
  `);
  stmt.run(artfile, title, type, date, alt, description, id);
  return id;
}

// TODO: delete entry
