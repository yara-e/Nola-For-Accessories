import { imagekit } from './imagekit';

// Max allowed raw file size on server (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Sanitizes file names to prevent ImageKit transformation parsing errors (400 Bad Request).
 * Strips underscores, converts spaces to hyphens, and forces lowercase.
 */
export function sanitizeFileName(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf('.');

  const ext = lastDotIndex !== -1 ? fileName.substring(lastDotIndex).toLowerCase() : '';
  const nameWithoutExt = lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;

  const cleanName = nameWithoutExt
    .toLowerCase()                     // Force lowercase
    .replace(/\s+/g, '-')             // Replace spaces with hyphens
    .replace(/_/g, '-')              // Replace underscores with hyphens (prevents ImageKit URL reserved char bugs)
    .replace(/[^a-z0-9-]/g, '');      // Remove special characters

  return `${cleanName}${ext}`;
}

/**
 * Uploads a file buffer or base64 string to ImageKit into a specified folder.
 */
export async function uploadToImageKit(
  file: File | null,
  folder: 'categories' | 'products'
): Promise<{ success: boolean; url?: string; fileId?: string; error?: string }> {
  if (!file || file.size === 0) {
    return { success: true, url: '' };
  }

  // File size validation
  if (file.size > MAX_FILE_SIZE) {
    return { success: false, error: 'File size exceeds the 5MB limit.' };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64File = buffer.toString('base64');

    const cleanName = sanitizeFileName(file.name || 'uploaded-image.png');

    const uploadResponse = await imagekit.upload({
      file: base64File,
      fileName: cleanName,
      folder: `/${folder}`,
      useUniqueFileName: true, // Prevents overwriting files with identical names
    });

    return {
      success: true,
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
    };
  } catch (error) {
    console.error(`Failed to upload image to ImageKit (folder: ${folder}):`, error);
    return { success: false, error: 'Image upload failed. Please try again.' };
  }
}

/**
 * Extracts the fileId from an ImageKit URL or deletes directly if fileId is provided.
 * Useful when updating or deleting a product/category to keep ImageKit storage clean.
 */
export async function deleteFromImageKit(fileIdOrUrl: string): Promise<boolean> {
  if (!fileIdOrUrl) return false;

  try {
    // If a full URL is passed, fetch the file ID from ImageKit API
    let fileId = fileIdOrUrl;

    if (fileIdOrUrl.startsWith('http')) {
      const fileName = fileIdOrUrl.split('/').pop() || '';
      const files = await imagekit.listFiles({ searchQuery: `name="${fileName}"` });

      if (files && files.length > 0) {
        fileId = (files[0] as { fileId: string }).fileId;
      } else {
        return false;
      }
    }

    await imagekit.deleteFile(fileId);
    return true;
  } catch (error) {
    console.error('Failed to delete image from ImageKit:', error);
    return false;
  }
}