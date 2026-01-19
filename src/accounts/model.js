import { connection } from "../service/db.js";

export function create() {
  // Creates accounts table if not exist
  const db = connection();
  const stmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS "accounts" (
      "id"	INTEGER NOT NULL UNIQUE,
      "username"	TEXT NOT NULL,
      "password"	TEXT NOT NULL,
      "salt"       TEXT NOT NULL,
      "permission"	TEXT NOT NULL,
      PRIMARY KEY("id" AUTOINCREMENT)
    )
    `);
  return stmt.all();
}

export function get(id) {
  // Gets one entry with all columns via id
  const db = connection();
  const stmt = db.prepare(`
    SELECT id, username, password, salt, permission
    FROM accounts
    WHERE id = ?
  `);
  return stmt.get(id);
}

export function getPermissionById(id) {
  const account = get(id);
  return account.permission;
}

export function add({ username, password, salt, permission }) {
  // Adds a new entry
  const db = connection();
  const stmt = db.prepare(`
    INSERT INTO accounts (username, password, salt, permission)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(username, password, salt, permission);
  return result.lastInsertRowid;
}

export function getByUsername(username) {
  // Checks the table for all 
  const db = connection();
  const stmt = db.prepare(`
    SELECT id, username, password, salt, permission
    FROM accounts
    WHERE username = ? 
  `);
  return stmt.get(username);
}
