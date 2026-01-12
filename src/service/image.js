import * as path from "jsr:@std/path";
import * as mediaTypes from "jsr:@std/media-types";

const POST_FILE_LIMIT = 1024 * 1024 * 5; // 5 MB

export function validateImage(file) {
  if (!file) return "Art file is required";
  if (file.size == 0) return "Art file is required";
  if (file.size > POST_FILE_LIMIT) return "File too big. (Must be below 5MB)";
  if (!isMimetypeOk(file.type) || !isExtensionOk(file.name))
    return "Invalid file type. (Must be png, jpg or gif)";
  return undefined;
}

function isMimetypeOk(type) {
  const validMimeTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
  return validMimeTypes.includes(type);
}

function isExtensionOk(filename) {
  const validExtensions = [".png", ".jpeg", ".jpg", ".gif"];
  const fileExtension = filename
    .slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2)
    .toLowerCase();
  return validExtensions.includes(`.${fileExtension}`);
}

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
    "gallery",
    crypto.randomUUID() + "." + mediaTypes.extension(file.type)
  );
}

export async function deleteImage(imageName) {
  const filePath = path.join(Deno.cwd(), "public", imageName);
  try {
    await Deno.remove(filePath);
    return `Image ${imageName} deleted successfully.`;
  } catch (error) {
    console.error(`Error deleting image: ${error.message}`);
    return null; // Return null on error
  }
}
