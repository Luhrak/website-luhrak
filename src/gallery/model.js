import { connection } from "../service/db.js";

export function create() {
  // Creates gallery table if not exist
  const db = connection();
  const stmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS "gallery" (
      "id"	INTEGER NOT NULL UNIQUE,
      "artfile"	TEXT NOT NULL,
      "title"	TEXT NOT NULL,
      "date"	TEXT NOT NULL,
      "alt"	TEXT DEFAULT 'An artpiece',
      "description"	TEXT,
      "price_id" INTEGER,
      PRIMARY KEY("id" AUTOINCREMENT)
    )
    `);
  return stmt.all();
}

export function list() {
  // Gets a list with all entries
  const db = connection();
  const stmt = db.prepare(`
    SELECT id, artfile, title, date, alt, description 
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
    SELECT id, artfile, title, date, alt, description, price_id 
    FROM gallery
    WHERE id = ?
  `);
  return stmt.get(id);
}

export function add({ artfile, title, date, alt, description, price_id }) {
  // Adds a new entry
  const db = connection();
  const stmt = db.prepare(`
    INSERT INTO gallery (artfile, title, date, alt, description, price_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(artfile, title, date, alt, description, price_id);
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

export function update(
  id,
  { artfile, title, date, alt, description, price_id }
) {
  // Updates an existing entry
  const db = connection();
  const stmt = db.prepare(`
    UPDATE gallery
    SET artfile = ?, title = ?, date = ?, alt = ?, description = ?, price_id = ?
    WHERE id = ?
  `);
  stmt.run(artfile, title, date, alt, description, price_id, id);
  return id;
}
export function listByPrice(priceId) {
  const db = connection();
  const stmt = db.prepare(`
    SELECT id, artfile, alt
    FROM gallery
    WHERE price_id = ?
    ORDER BY id DESC
  `);
  return stmt.all(priceId);
}
export function listByPriceId(priceId) {
  const db = connection();
  const stmt = db.prepare(`
    SELECT id, artfile, alt
    FROM gallery
    WHERE price_id = ?
    ORDER BY id DESC
  `);
  return stmt.all(priceId);
}