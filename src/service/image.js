import * as path from "jsr:@std/path";
import * as mediaTypes from "https://deno.land/std/media_types/mod.ts";

const POST_FILE_LIMIT = 1024 * 1024 * 5; // 5 MB

export function validateImage(file) {
  if (!file) return "Art file is required";
  if (file.size == 0) return "Art file is required";
  if (file.size > POST_FILE_LIMIT) {
    return "Datei zu groß.";
  }
  if (isMimetypeOk(file.type) && isExtensionOk(file.name)) return;
  return "Dateiformat nicht zulässig.";
}

const isMimetypeOk = (type) => {
  const validMimeTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
  return validMimeTypes.includes(type);
};

const isExtensionOk = (filename) => {
  const validExtensions = [".png", ".jpeg", ".jpg", ".gif"];
  const fileExtension = filename
    .slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2)
    .toLowerCase();
  return validExtensions.includes(`.${fileExtension}`);
};

export async function uploadImage(image) {
  const filename = generateFilename(image);
  const filePath = path.join(Deno.cwd(), "public", filename);

  try {
    const destFile = await Deno.open(filePath, {
      create: true,
      write: true,
      truncate: true,
    });

    await image.stream().pipeTo(destFile.writable);
    // destFile.close();
    return `/${filename.replace(/\\/g, "/")}`;
  } catch (error) {
    console.error(`Error uploading image: ${error.message}`);
    return null; // Return null on error
  }
}

function generateFilename(file) {
  return path.join(
    "upload",
    crypto.randomUUID() + "." + mediaTypes.extension(file.type)
  );
}
