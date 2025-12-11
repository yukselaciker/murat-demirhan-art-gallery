// ============================================
// CLOUDFLARE R2 CONFIG - MURAT DEMİRHAN PORTFOLYO
// Image storage using Cloudflare R2 (S3 compatible)
// ============================================

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// R2 Client Configuration
const r2Client = new S3Client({
    region: "auto",
    endpoint: import.meta.env.VITE_R2_ENDPOINT,
    credentials: {
        accessKeyId: import.meta.env.VITE_R2_ACCESS_KEY,
        secretAccessKey: import.meta.env.VITE_R2_SECRET_KEY,
    },
});

/**
 * Upload a file to Cloudflare R2
 * @param file - The file to upload
 * @param folder - The folder path (default: "artworks")
 * @returns The public URL of the uploaded file
 */
export const uploadToR2 = async (file, folder = "artworks") => {
    try {
        // Clean filename: remove Turkish chars and special characters
        const cleanName = file.name
            .replace(/[^a-zA-Z0-9.]/g, "-")
            .toLowerCase();

        // Create unique filename with timestamp
        const fileName = `${folder}/${Date.now()}-${cleanName}`;

        // Create upload command
        const command = new PutObjectCommand({
            Bucket: import.meta.env.VITE_R2_BUCKET_NAME,
            Key: fileName,
            Body: file,
            ContentType: file.type,
        });

        // Execute upload
        await r2Client.send(command);

        console.log("[R2] Upload successful:", fileName);

        // Return the public URL
        // Example: https://pub-xyz.r2.dev/artworks/123-resim.jpg
        const fullUrl = `${import.meta.env.VITE_R2_PUBLIC_URL}/${fileName}`;
        return fullUrl;

    } catch (error) {
        console.error("[R2] Upload error:", error);
        throw error;
    }
};

/**
 * Check if R2 is properly configured
 */
export const isR2Configured = () => {
    return !!(
        import.meta.env.VITE_R2_ENDPOINT &&
        import.meta.env.VITE_R2_ACCESS_KEY &&
        import.meta.env.VITE_R2_SECRET_KEY &&
        import.meta.env.VITE_R2_BUCKET_NAME &&
        import.meta.env.VITE_R2_PUBLIC_URL
    );
};

export default r2Client;
