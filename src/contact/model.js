import { connection } from "../service/db.js";

// Create messages table if not exist
export function create() {
  const db = connection();
  const stmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS "messages" (
      "id" INTEGER NOT NULL UNIQUE,
      "name" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "subject" TEXT,
      "message" TEXT NOT NULL,
      "is_new" INTEGER NOT NULL DEFAULT 1,
      "created_at" TEXT,
      PRIMARY KEY("id" AUTOINCREMENT)
    )
  `);
  return stmt.all();
}

// Full list (optional admin view)
export function list() {
  const db = connection();
  return db
    .prepare(
      `
      SELECT id, name, email, subject, message
      FROM messages
      ORDER BY id DESC
    `
    )
    .all();
}

export function listNew() {
  const db = connection();
  return db
    .prepare(
      `
      SELECT id, name, email, subject, message, created_at
      FROM messages
      WHERE is_new = 1
      ORDER BY created_at DESC
    `
    )
    .all();
}

// Gelesene
export function listRead() {
  const db = connection();
  return db
    .prepare(
      `
  SELECT id, name, email, subject, message, created_at
      FROM messages
      WHERE is_new = 0
      ORDER BY created_at DESC
    `
    )
    .all();
}

export function markAsRead(id) {
  const db = connection();
  return db
    .prepare(
      `
      UPDATE messages
      SET is_new = 0
      WHERE id = ?
    `
    )
    .run(id);
}
export function del(id) {
  const db = connection();
  return db
    .prepare(
      `
      DELETE FROM messages WHERE id = ?
    `
    )
    .run(id);
}
// Single entry
export function get(id) {
  const db = connection();
  return db
    .prepare(
      `
      SELECT id, name, email, subject, message
      FROM messages
      WHERE id = ?
    `
    )
    .get(id);
}

// Add new contact entry
export function add({ name, email, subject, message }) {
  const db = connection();
  const createdAt = new Date().toISOString().replace("T", " ").slice(0, 19);
  const result = db
    .prepare(
      `
      INSERT INTO messages (name, email, subject, message, is_new, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `
    )
    .run(name, email, subject, message, 1, createdAt);

  return result.lastInsertRowid;
}
