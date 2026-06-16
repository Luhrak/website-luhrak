import { connection } from "../service/db.js";

export async function create() {
  // Creates accounts table if not exist
  const db = connection();
  await db.queryArray`
    CREATE TABLE IF NOT EXISTS public."accounts" (
      "id" SERIAL NOT NULL PRIMARY KEY,
      "username"	TEXT NOT NULL,
      "password"	TEXT NOT NULL,
      "salt"       TEXT NOT NULL,
      "permission"	TEXT NOT NULL
    )
    `;
}

export async function get(id) {
  // Gets one entry with all columns via id
  const db = connection();
  return (
    await db.queryObject`
    SELECT "id", "username", "password", "salt", "permission"
    FROM public."accounts"
    WHERE id = ${id}
  `
  ).rows[0];
}

export async function getPermissionById(id) {
  const { permission } = await get(id);
  return permission;
}

export async function add({ username, password, salt, permission }) {
  // Adds a new entry
  const db = connection();
  return (
    await db.queryObject`
    INSERT INTO public."accounts" ("username", "password", "salt", "permission")
    VALUES (${username}, ${password}, ${salt}, ${permission})
    RETURNING "id"
  `
  ).rows[0].id;
}

export async function getByUsername(username) {
  // Checks the table for all
  const db = connection();
  let result = (
    await db.queryObject`
    SELECT "id", "username", "password", "salt", "permission"
    FROM public."accounts"
    WHERE username = ${username}
  `
  ).rows[0];
  return result;
}
