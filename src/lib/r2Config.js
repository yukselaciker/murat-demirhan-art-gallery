// ============================================
// CLOUDFLARE R2 CONFIG - MURAT DEMİRHAN PORTFOLYO
// Image storage using Cloudflare R2 (S3 compatible)
// Browser-compatible implementation
// ============================================

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Check if R2 is properly configured (call this before creating client)
export const isR2Configured = () => {
    const configured = !!(
        import.meta.env.VITE_R2_ENDPOINT &&
        import.meta.env.VITE_R2_ACCESS_KEY &&
        import.meta.env.VITE_R2_SECRET_KEY &&
        import.meta.env.VITE_R2_BUCKET_NAME &&
        import.meta.env.VITE_R2_PUBLIC_URL
    );

    if (!configured) {
        console.warn('[R2] Missing environment variables:',
            !import.meta.env.VITE_R2_ENDPOINT && 'VITE_R2_ENDPOINT',
            !import.meta.env.VITE_R2_ACCESS_KEY && 'VITE_R2_ACCESS_KEY',
            !import.meta.env.VITE_R2_SECRET_KEY && 'VITE_R2_SECRET_KEY',
            !import.meta.env.VITE_R2_BUCKET_NAME && 'VITE_R2_BUCKET_NAME',
            !import.meta.env.VITE_R2_PUBLIC_URL && 'VITE_R2_PUBLIC_URL'
        );
    }

    return configured;
};

// Create R2 Client (only if configured)
let r2Client = null;

const getR2Client = () => {
    if (r2Client) return r2Client;

    if (!isR2Configured()) {
        throw new Error('R2 is not configured. Check your environment variables.');
    }

    r2Client = new S3Client({
        region: "auto",
        endpoint: import.meta.env.VITE_R2_ENDPOINT,
        forcePathStyle: true, // CRITICAL: Use path-style URLs
        credentials: {
            accessKeyId: import.meta.env.VITE_R2_ACCESS_KEY,
            secretAccessKey: import.meta.env.VITE_R2_SECRET_KEY,
        },
    });

    return r2Client;
};

/**
 * Upload a file to Cloudflare R2
 * @param file - The File object to upload
 * @param folder - The folder path (default: "artworks")
 * @returns The public URL of the uploaded file
 */
export const uploadToR2 = async (file, folder = "artworks") => {
    console.log('[R2] Starting upload for:', file.name, 'Size:', file.size);

    try {
        // Get client (will throw if not configured)
        const client = getR2Client();

        // Clean filename: remove Turkish chars and special characters
        const cleanName = file.name
            .replace(/[^a-zA-Z0-9.]/g, "-")
            .replace(/-+/g, "-") // Remove multiple dashes
            .toLowerCase();

        // Create unique filename with timestamp
        const fileName = `${folder}/${Date.now()}-${cleanName}`;
        console.log('[R2] Uploading to:', fileName);

        // Convert File to ArrayBuffer for browser compatibility
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        // Create upload command
        const command = new PutObjectCommand({
            Bucket: import.meta.env.VITE_R2_BUCKET_NAME,
            Key: fileName,
            Body: uint8Array,
            ContentType: file.type,
        });

        // Execute upload
        console.log('[R2] Sending to R2...');
        await client.send(command);

        console.log("[R2] ✅ Upload successful:", fileName);

        // Return the public URL
        const fullUrl = `${import.meta.env.VITE_R2_PUBLIC_URL}/${fileName}`;
        console.log('[R2] Public URL:', fullUrl);
        return { key: fileName, publicUrl: fullUrl };

    } catch (error) {
        console.error("[R2] ❌ Upload error:", error);
        throw error;
    }
};

export default getR2Client;
