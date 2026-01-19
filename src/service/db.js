import { DatabaseSync } from "node:sqlite";

let _db = null;

export function initConnection(path) {
  // Initialize connetion to databankW
  if (!_db) {
    _db = new DatabaseSync(path); // Also creates the file if not exist
    _db.exec("PRAGMA foreign_keys = ON;"); // else foreign keys wont work
  }
  return _db;
}

export function connection() {
  // Get current connection
  if (!_db) {
    throw new Error(
      "DB connection not initialized. Call initConnection() first.",
    );
  }
  return _db;
}
