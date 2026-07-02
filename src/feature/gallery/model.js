import { connection } from "../../service/db.js";

export async function create() {
  // Creates gallery table if not exist
  const db = connection();
  await db.queryArray`
    CREATE TABLE IF NOT EXISTS public."gallery" (
      "id" SERIAL NOT NULL PRIMARY KEY,
      "artfile"	TEXT NOT NULL,
      "title"	TEXT NOT NULL,
      "date"	TEXT NOT NULL,
      "alt"	TEXT DEFAULT 'An artpiece',
      "description"	TEXT,
      "price_id" INTEGER
    )
    `;
}

export async function list() {
  // Gets a list with all entries
  const db = connection();
  return (
    await db.queryObject`
    SELECT "id", "artfile", "title", "date", "alt", "description" 
    FROM public."gallery"
  `
  ).rows;
}

export async function listMinimal() {
  // Gets a list with all entries but only columns needed for the gallery tab
  const db = connection();
  return (
    await db.queryObject`
    SELECT "id", "artfile", "alt"  
    FROM public."gallery"
    ORDER BY id DESC
  `
  ).rows;
}

export async function listByPrice(priceId) {
  const db = connection();
  return (
    await db.queryObject`
    SELECT "id", "artfile", "alt"
    FROM public."gallery"
    WHERE price_id = ${priceId}
    ORDER BY id DESC
  `
  ).rows;
}

export async function listByPriceId(priceId) {
  const db = connection();
  return (
    await db.queryObject`
    SELECT "id", "artfile", "alt"
    FROM public."gallery"
    WHERE price_id = ${priceId}
    ORDER BY id DESC
  `
  ).rows;
}

export async function get(id) {
  // Gets one entry with all columns via id
  const db = connection();
  return (
    await db.queryObject`
    SELECT "id", "artfile", "title", "date", "alt", "description", "price_id" 
    FROM public."gallery"
    WHERE id = ${id}
  `
  ).rows[0];
}

export async function add({
  artfile,
  title,
  date,
  alt,
  description,
  price_id,
}) {
  // Adds a new entry
  const db = connection();
  const altValue = alt?.trim?.() || alt;

  if (altValue === undefined || altValue === null || altValue === "") {
    return (
      await db.queryObject`
        INSERT INTO public."gallery" ("artfile", "title", "date", "description", "price_id")
        VALUES (${artfile}, ${title}, ${date}, ${description}, ${price_id})
        RETURNING "id"
      `
    ).rows[0].id;
  }

  return (
    await db.queryObject`
      INSERT INTO public."gallery" ("artfile", "title", "date", "alt", "description", "price_id")
      VALUES (${artfile}, ${title}, ${date}, ${alt}, ${description}, ${price_id})
      RETURNING "id"
    `
  ).rows[0].id;
}

export async function update(
  id,
  { artfile, title, date, alt, description, price_id },
) {
  const db = connection();
  const altValue =
    alt === undefined || alt === null || alt.trim() === "" ? null : alt;

  if (price_id) {
    await db.queryObject`
        UPDATE public."gallery"
        SET
          "artfile" = ${artfile},
          "title" = ${title},
          "date" = ${date},
          "alt" = ${altValue},
          "description" = ${description},
          "price_id" = ${price_id}
        WHERE id = ${id}
      `;
  } else {
    await db.queryObject`
        UPDATE public."gallery"
        SET
          "artfile" = ${artfile},
          "title" = ${title},
          "date" = ${date},
          "alt" = ${altValue},
          "description" = ${description}
        WHERE id = ${id}
      `;
  }
  return id;
}

export async function remove(id) {
  // Delets one entry via id
  const db = connection();
  await db.queryObject`
    DELETE 
    FROM public."gallery"
    WHERE id = ${id}
  `;
}
