import * as path from "jsr:@std/path";
import * as mediaTypes from "jsr:@std/media-types";

const POST_FILE_LIMIT = 1024 * 1024 * 5; // 5 MB

export function validateImage(file) {
  // Validate if the image is valid (exists, not too big, right file type) and returns undefined or an error
  if (!file) return "Image file is required";
  if (file.size == 0) return "Image file is required";
  if (file.size > POST_FILE_LIMIT) return "File too big. (Must be below 5MB)";
  if (!isMimetypeOk(file.type) || !isExtensionOk(file.name))
    return "Invalid file type. (Must be png, jpg or gif)";
  return undefined;
}

function isMimetypeOk(type) {
  // Validates the mime type
  const validMimeTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
  return validMimeTypes.includes(type);
}

function isExtensionOk(filename) {
  // Checks if the extention is valid
  const validExtensions = [".png", ".jpeg", ".jpg", ".gif"];
  const fileExtension = filename
    .slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2)
    .toLowerCase();
  return validExtensions.includes(`.${fileExtension}`);
}

export async function uploadImage(image, folderPath) {
  // Uploads the image into the public folder under the given folder path and returns the path of the fiel
  const filename = generateFilenameOld(image, folderPath);
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

function generateFilenameOld(file, folderPath) {
  // Generates a random file name so no two image files share a name
  return path.join(
    "upload",
    folderPath,
    crypto.randomUUID() + "." + mediaTypes.extension(file.type),
  );
}

export function generateFilename(file) {
  // Generates a random file name so no two image files share a name
  return crypto.randomUUID() + "." + mediaTypes.extension(file.type);
}

export async function deleteImage(imageName) {
  // Deletes the image file of the given path
  const filePath = path.join(Deno.cwd(), "public", imageName);
  try {
    await Deno.remove(filePath);
    return `Image ${imageName} deleted successfully.`;
  } catch (error) {
    console.error(`Error deleting image: ${error.message}`);
    return null; // Return null on error
  }
}
