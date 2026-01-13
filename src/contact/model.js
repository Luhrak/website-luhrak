import { connection } from "../service/db.js";

// Create contacts table if not exist
export function create() {
  const db = connection();
  const stmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS "contacts" (
      "id" INTEGER NOT NULL UNIQUE,
      "name" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "subject" TEXT,
      "message" TEXT NOT NULL,
      PRIMARY KEY("id" AUTOINCREMENT)
    )
  `);
  return stmt.all();
}

// Full list (optional admin view)
export function list() {
  const db = connection();
  return db
    .prepare(`
      SELECT id, name, email, subject, message
      FROM contacts
      ORDER BY id DESC
    `)
    .all();
}

// Single entry
export function get(id) {
  const db = connection();
  return db
    .prepare(`
      SELECT id, name, email, subject, message
      FROM contacts
      WHERE id = ?
    `)
    .get(id);
}

// Add new contact entry
export function add({ name, email, subject, message }) {
  const db = connection();
  const result = db
    .prepare(`
      INSERT INTO contacts (name, email, subject, message)
      VALUES (?, ?, ?, ?)
    `)
    .run(name, email, subject, message);

  return result.lastInsertRowid;
}

// Delete entry (optional)
export function del(id) {
  const db = connection();
  return db
    .prepare(`
      DELETE FROM contacts WHERE id = ?
    `)
    .run(id);
}
