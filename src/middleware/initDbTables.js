import { create as createGalleryTable } from "../feature/gallery/model.js";
import { create as createPricesTable } from "../feature/prices/model.js";
import { create as createMessagesTable } from "../feature/contact/model.js";
import { create as createAccountsTable } from "../feature/accounts/model.js";
import { createAdminUser } from "../feature/accounts/model.js";
import { create as createLoggingTable } from "../middleware/logging.js";
import { create as createSessionTable } from "../feature/session/model.js";

export async function initDbTables() {
  // Creates the necessary tables in data.db if they are not there to prevent errors
  // Also allows having the databank be gitignored with no issues
  await createGalleryTable();
  await createPricesTable();
  await createMessagesTable();
  await createAccountsTable();
  await createAdminUser();
  await createSessionTable();
  // await createLoggingTable();
}
