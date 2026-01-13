import { DatabaseSync } from "node:sqlite";
import { create as createGalleryTable } from "../gallery/model.js";
import { create as createPricesTable } from "../prices/model.js";
import { create as createMessagesTable } from "../contact/model.js";
import { create as createAccountsTable } from "../accounts/model.js";
import { create as createLoggingTable } from "../middleware/logging.js";

let _db = null;

// initialize connetion to databank
export function initConnection(path) {
  if (!_db) {
    _db = new DatabaseSync(path); // Also creates the file if not exist
    _db.exec("PRAGMA foreign_keys = ON;"); // else foreign keys wont work
    // Create required tables in the db
    createGalleryTable();
    createPricesTable();
    createMessagesTable();
    createAccountsTable();
    createLoggingTable();
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
