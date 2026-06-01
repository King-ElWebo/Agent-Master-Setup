import { put, del } from "@vercel/blob";
import fs from "fs/promises";
import path from "path";

/**
 * Creates a slug-friendly, lowercase, timestamp-prefixed filename limited strictly to 90 characters.
 */
export function createSafeFileName(originalName: string): string {
  const cleanExtension = path.extname(originalName).toLowerCase();
  const baseNameWithoutExt = path.basename(originalName, cleanExtension).toLowerCase();

  // Sluggify: convert non-alphanumeric characters to a single hyphen
  const sluggified = baseNameWithoutExt
    .replace(/[^a-z0-9]+/g, "-")
    // Trim leading/trailing hyphens
    .replace(/(^-|-$)/g, "");

  const timestamp = Date.now().toString();
  const prefix = `${timestamp}-`;

  // Enforce 90 characters maximum
  const maxSlugLength = 90 - prefix.length - cleanExtension.length;
  const truncatedSlug = sluggified.substring(0, maxSlugLength).replace(/-$/, "");

  return `${prefix}${truncatedSlug}${cleanExtension}`;
}

export const StorageEngine = {
  /**
   * Uploads a file, dynamically choosing between Vercel Blob cloud storage and local public filesystem.
   */
  async upload(file: File): Promise<string> {
    const isHeadless = process.env.ACTIVE_MODE === "HEADLESS_CMS";
    const safeName = createSafeFileName(file.name);

    if (isHeadless) {
      // HEADLESS_CMS Behavior: Save to Vercel Blob
      try {
        const blob = await put(safeName, file, {
          access: "public",
          addRandomSuffix: true,
          contentType: file.type,
        });
        return blob.url;
      } catch (error) {
        console.error("Vercel Blob upload failed, returning fallback placeholder path:", error);
        throw error;
      }
    } else {
      // LOCAL_PRISMA Behavior: Save to public/uploads/
      try {
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await fs.mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, safeName);
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        await fs.writeFile(filePath, buffer);
        return `/uploads/${safeName}`;
      } catch (error) {
        console.error("Local filesystem upload failed:", error);
        throw error;
      }
    }
  },

  /**
   * Deletes a file, dynamically choosing between Vercel Blob cloud deletion and local filesystem unlinking.
   */
  async delete(fileUrl: string): Promise<void> {
    const isHeadless = process.env.ACTIVE_MODE === "HEADLESS_CMS";

    if (isHeadless) {
      // HEADLESS_CMS Behavior: Vercel Blob Deletion
      if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
        try {
          await del(fileUrl);
          console.log(`StorageEngine (Vercel Blob): Deleted asset: ${fileUrl}`);
        } catch (error) {
          console.error(`StorageEngine (Vercel Blob): Failed to delete asset: ${fileUrl}`, error);
        }
      }
    } else {
      // LOCAL_PRISMA Behavior: Local public/uploads/ Deletion
      if (fileUrl.startsWith("/uploads/")) {
        const filename = fileUrl.replace("/uploads/", "");
        const filePath = path.join(process.cwd(), "public", "uploads", filename);
        try {
          await fs.unlink(filePath);
          console.log(`StorageEngine (Local): Deleted asset: ${filePath}`);
        } catch (error: any) {
          if (error.code === "ENOENT") {
            console.warn(`StorageEngine (Local): File not found at path: ${filePath}`);
          } else {
            console.error(`StorageEngine (Local): Failed to delete asset: ${filePath}`, error);
          }
        }
      }
    }
  },
};
