import { create as createGalleryTable } from "../gallery/model.js";
import { create as createPricesTable } from "../prices/model.js";
import { create as createMessagesTable } from "../contact/model.js";
import { create as createAccountsTable } from "../accounts/model.js";
import { create as createLoggingTable } from "../middleware/logging.js";

export function initDbTables() {
  // Creates the necessary tables in data.db if they are not there to prevent errors
  // Also allows having the databank be gitignored with no issues
  createGalleryTable();
  createPricesTable();
  createMessagesTable();
  createAccountsTable();
  createLoggingTable();
}
