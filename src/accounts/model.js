import { connection } from "../service/db.js";

export function create() {
  // Creats accounts table if not exist
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

export function get(id) {
  // Gets one entry with all columns via id
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

export function add({ username, password, permission }) {
  // Adds a new entry
  const db = connection();
  const stmt = db.prepare(`
    INSERT INTO accounts (username, password, permission)
    VALUES (?, ?, ?)
  `);
  const result = stmt.run(username, password, permission);
  return result.lastInsertRowid;
}

export function match({ username, password }) {
  // Checks the table for a username and password combination
  const db = connection();
  const stmt = db.prepare(`
    SELECT id 
    FROM accounts
    WHERE username = ?  AND password = ?
  `);
  return stmt.get(username, password);
}
