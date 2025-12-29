import { connection } from "../service/db.js";

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
