import { connection } from "../service/db.js";

export function create() {
  // Creates prices table if not exist
  const db = connection();
  const stmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS prices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      previewfile TEXT,
      title TEXT NOT NULL,
      price INTEGER NOT NULL,
      additions TEXT,
      short_description TEXT NOT NULL,
      description TEXT NOT NULL
    )
  `);
  return stmt.all();
}

export function list() {
  // Gets a list with all entries
  const db = connection();
  return db
    .prepare(
      `
    SELECT id, previewfile, title, price, additions, short_description, description
    FROM prices
    ORDER BY id DESC
  `
    )
    .all();
}

export function listMinimal() {
  // Gets a list with all entries but only columns needed for the prices tab
  const db = connection();
  return db
    .prepare(
      `
    SELECT id, previewfile, title, price, additions, short_description
    FROM prices
    ORDER BY id DESC
    `
    )
    .all();
}

export function get(id) {
  // Gets one entry with all columns via id
  const db = connection();
  return db
    .prepare(
      `
    SELECT id, previewfile, title, price, additions, short_description, description
    FROM prices
    WHERE id = ?
  `
    )
    .get(id);
}

export function add({
  previewfile,
  title,
  description,
  price,
  additions,
  short_description,
}) {
  // Adds a new entry
  const db = connection();
  const result = db
    .prepare(
      `
    INSERT INTO prices (previewfile, title, price, additions, short_description, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `
    )
    .run(previewfile, title, price, additions, short_description, description);

  return result.lastInsertRowid;
}

export function remove(id) {
  // delets one entry via id
  const db = connection();
  return db
    .prepare(
      `
    DELETE FROM prices WHERE id = ?
  `
    )
    .run(id);
}

export function update(
  id,
  { previewfile, title, price, additions, short_description, description }
) {
  // Updates an existing entry
  const db = connection();
  const stmt = db.prepare(
    `
    UPDATE prices
    SET previewfile = ?, title = ?, price = ?, additions = ?, short_description = ?, description = ?
    WHERE id = ?
  `
  );
  stmt.run(
    previewfile,
    title,
    price,
    additions,
    short_description,
    description,
    id
  );

  return id;
}
