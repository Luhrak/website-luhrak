import { connection } from "../../service/db.js";

export async function create() {
  // Creates prices table if not exist
  const db = connection();
  await db.queryArray`
    CREATE TABLE IF NOT EXISTS public."prices" (
      "id" SERIAL NOT NULL PRIMARY KEY,
      "previewfile" TEXT,
      "alt" TEXT DEFAULT 'A price preview',
      "title" TEXT NOT NULL,
      "price" INTEGER NOT NULL,
      "additions" TEXT,
      "short_description" TEXT NOT NULL,
      "description" TEXT NOT NULL
    )
  `;
}

export async function list() {
  // Gets a list with all entries
  const db = connection();
  return (
    await db.queryObject`
    SELECT "id", "previewfile", "alt", "title", "price", "additions", "short_description", "description"
    FROM public."prices"
    ORDER BY id DESC
  `
  ).rows;
}

export async function listMinimal() {
  // Gets a list with all entries but only columns needed for the prices tab
  const db = connection();
  return (
    await db.queryObject`
    SELECT "id", "previewfile", "alt", "title", "price", "additions", "short_description"
    FROM public."prices"
    ORDER BY id DESC
  `
  ).rows;
}

export async function get(id) {
  // Gets one entry with all columns via id
  const db = connection();
  return (
    await db.queryObject`
    SELECT "id", "previewfile", "alt", "title", "price", "additions", "short_description", "description"
    FROM public."prices"
    WHERE id = ${id}
  `
  ).rows[0];
}

export async function add({
  previewfile,
  alt,
  title,
  description,
  price,
  additions,
  short_description,
}) {
  // Adds a new entry
  const db = connection();
  const altValue = alt?.trim?.() || alt;

  if (altValue === undefined || altValue === null || altValue === "") {
    return (
      await db.queryObject`
      INSERT INTO public."prices" ("previewfile", "title", "description", "price", "additions", "short_description")
      VALUES (${previewfile}, ${title}, ${description}, ${price}, ${additions}, ${short_description})
      RETURNING "id"
    `
    ).rows[0].id;
  }

  return (
    await db.queryObject`
    INSERT INTO public."prices" ("previewfile", "alt", "title", "description", "price", "additions", "short_description")
    VALUES (${previewfile}, ${alt}, ${title}, ${description}, ${price}, ${additions}, ${short_description})
    RETURNING "id"
    `
  ).rows[0].id;
}

export async function update(
  id,
  { previewfile, alt, title, price, additions, short_description, description },
) {
  // Updates an existing entry
  const db = connection();
  await db.queryArray`
    UPDATE public."prices"
    SET "previewfile" = ${previewfile}, 
        "alt" = ${alt}, 
        "title" = ${title}, 
        "price" = ${price}, 
        "additions" = ${additions}, 
        "short_description" = ${short_description}, 
        "description" = ${description}
    WHERE id = ${id}
  `;

  return id;
}

export async function remove(id) {
  // Delets one entry via id
  const db = connection();
  await db.queryObject`
    DELETE FROM public."prices" WHERE id = ${id}
  `;
}
