import { connection } from "../../service/db.js";

export async function create() {
  // Creates sessions table if not exist
  const db = connection();
  await db.queryArray`
    CREATE TABLE IF NOT EXISTS public."sessions" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "content"	jsonb NOT NULL,
      "maxage" BIGINT NOT NULL,
      "date" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
    `;
}

export async function get(id) {
  const db = connection();
  const row = (
    await db.queryObject`
      SELECT "id", "content", "maxage", "date"
      FROM public."sessions"
      WHERE "id" = ${id}
    `
  ).rows[0];

  if (!row) return;
  row.content =
    typeof row.content === "string" ? JSON.parse(row.content) : row.content;

  return row;
}

export async function set(id, content, maxage) {
  // Adds a new entry
  const db = connection();
  return (
    await db.queryObject`
    INSERT INTO public."sessions" ("id", "content", "maxage", "date")
    VALUES (${id}, ${content}, ${maxage}, NOW())
    RETURNING "id"
  `
  ).rows[0].id;
}

export async function upsert(id, content, maxage) {
  const db = connection();

  const result = (
    await db.queryObject`
      UPDATE public."sessions"
      SET "content" = ${content},
          "maxage" = ${maxage},
          "date" = NOW()
      WHERE "id" = ${id}
      RETURNING "id"
    `
  ).rows[0];

  // If nothing updated (row not found), create it instead
  if (!result) return await set(id, content, maxage);

  return result.id;
}

export async function remove(id) {
  // Deletes one entry via id
  const db = connection();
  return (
    await db.queryObject`
    DELETE 
    FROM public."sessions"
    WHERE "id" = ${id}
  `
  ).rows[0];
}

export async function applyTimeout(id) {
  // Deletes the content thats over max age
  const currentSession = await get(id);
  if (!currentSession) return;

  const currentAge = Date.now() - new Date(currentSession.date).getTime();

  if (currentAge > currentSession.maxAge) await remove(id);
}
