import { connection } from "../service/db.js";

// Create accounts table if not exist
export function create() {
  const db = connection();
  const stmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS "accounts" (
      "id"	INTEGER NOT NULL UNIQUE,
      "username"	TEXT NOT NULL,
      "password"	TEXT NOT NULL,
      "permission"	TEXT NOT NULL,
      PRIMARY KEY("id" AUTOINCREMENT)
    )
    `);
  return stmt.all();
}

// Get one entry with all attributes via id
export function get(id) {
  const db = connection();
  const stmt = db.prepare(`
    SELECT id, username, password, permission
    FROM accounts
    WHERE id = ?
  `);
  return stmt.get(id);
}

export function getPermissionById(id) {
  const account = get(id);
  return account.permission;
}

// Checks the table for a username and password combination
export function match({ username, password }) {
  const db = connection();
  const stmt = db.prepare(`
    SELECT id 
    FROM accounts
    WHERE username = ?  AND password = ?
  `);
  return stmt.get(username, password);
}

// Adding a new entry
export function add({ username, password, permission }) {
  const db = connection();
  const stmt = db.prepare(`
    INSERT INTO accounts (username, password, permission)
    VALUES (?, ?, ?)
  `);
  const result = stmt.run(username, password, permission);
  return result.lastInsertRowid;
}
