import { connection } from "../service/db.js";

export function create() {
  // Creates messages table if not exist
  const db = connection();
  // is_new is a basically a bool but sqlite uses int instead
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

export function list() {
  // Gets a list with all entries
  const db = connection();
  return db
    .prepare(
      `
      SELECT id, name, email, subject, message
      FROM messages
      ORDER BY id DESC
    `,
    )
    .all();
}

export function listNew() {
  // List all not read messages
  const db = connection();
  return db
    .prepare(
      `
      SELECT id, name, email, subject, message, created_at
      FROM messages
      WHERE is_new = 1
      ORDER BY created_at DESC
    `,
    )
    .all();
}

export function listRead() {
  // List all read messages
  const db = connection();
  return db
    .prepare(
      `
  SELECT id, name, email, subject, message, created_at
      FROM messages
      WHERE is_new = 0
      ORDER BY created_at DESC
    `,
    )
    .all();
}

export function get(id) {
  // Get one entry with all columns via id
  const db = connection();
  return db
    .prepare(
      `
      SELECT id, name, email, subject, message
      FROM messages
      WHERE id = ?
    `,
    )
    .get(id);
}

export function add({ name, email, subject, message }) {
  // Add new contact entry
  const db = connection();
  const createdAt = new Date().toISOString().replace("T", " ").slice(0, 19);
  const result = db
    .prepare(
      `
      INSERT INTO messages (name, email, subject, message, is_new, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    )
    .run(name, email, subject, message, 1, createdAt);

  return result.lastInsertRowid;
}

export function remove(id) {
  // Delete one entry via id
  const db = connection();
  return db
    .prepare(
      `
      DELETE FROM messages WHERE id = ?
    `,
    )
    .run(id);
}

export function markAsRead(id) {
  // Mark one entry as read
  const db = connection();
  return db
    .prepare(
      `
      UPDATE messages
      SET is_new = 0
      WHERE id = ?
    `,
    )
    .run(id);
}
