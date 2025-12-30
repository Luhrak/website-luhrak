import { DatabaseSync } from "node:sqlite";
import { create } from "../gallery/model.js";

let _db = null;

// initialize connetion to databank
export function initConnection(path) {
  if (!_db) {
    _db = new DatabaseSync(path);
    create();
  }
  return _db;
}

// Get current connection
export function connection() {
  if (!_db) {
    throw new Error(
      "DB connection not initialized. Call initConnection() first."
    );
  }
  return _db;
}
