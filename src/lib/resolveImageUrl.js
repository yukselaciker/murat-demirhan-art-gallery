// ============================================
// UNIVERSAL IMAGE URL RESOLVER
// ============================================
// This helper normalizes all image references in the application to ensure
// they are served correctly on all devices (Desktop & Mobile) and environments.
//
// SUPPORTED INPUTS:
// 1. Raw R2 keys: "artworks/filename.jpg"
// 2. Old R2 URLs: "https://pub-....r2.dev/artworks/filename.jpg"
// 3. New Worker URLs: "https://cdn.muratdemirhan.com/artworks/filename.jpg"
// 4. Supabase URLs: "https://xyz.supabase.co/storage/..."
// 5. Local/Public images: "/images/artist.jpg" or "artist.jpg"

// Custom CDN domain (bypasses mobile carrier blocking of workers.dev)
const R2_WORKER_URL = import.meta.env.VITE_CDN_URL || "https://r2-images-proxy.yukselaciker.workers.dev";

/**
 * Resolves any image input to a production-ready URL.
 * 
 * @param {string | null | undefined} input - The raw image field value
 * @returns {string} - The fully qualified, usable URL (or empty string if invalid)
 */
export function resolveImageUrl(input) {
    if (!input) return "";

    // 1. Handle already correct Worker URLs
    if (input.startsWith(R2_WORKER_URL)) {
        return input;
    }

    // 2. Handle HTTP/HTTPS URLs
    if (input.startsWith("http")) {
        // SUPABASE & EXTERNAL: Return as-is (do not proxy)
        if (input.includes("supabase.co") || input.includes("cloudinary.com")) {
            return input;
        }

        try {
            const u = new URL(input);

            // OLD R2 URLS: Rewrite to Worker
            // Matches "pub-....r2.dev" or just "r2.dev"
            if (u.hostname.endsWith("r2.dev")) {
                // Pathname includes leading slash, e.g. "/artworks/file.jpg"
                return `${R2_WORKER_URL}${u.pathname}`;
            }

            // WORKER URLS (Safety check): Return as-is
            if (u.hostname.includes("workers.dev")) {
                return input;
            }

            // OTHER EXTERNAL URLS: Return as-is
            return input;

        } catch (e) {
            console.warn("[resolveImageUrl] Error parsing URL:", input, e);
            // Fall through to key handling if parsing fails
        }
    }

    // 3. Handle Absolute Paths (Local images in public folder)
    // e.g. "/images/logo.png" -> leave as is, it's relative to site root
    if (input.startsWith("/")) {
        // BUT check if it looks like an R2 key starting with slash
        // If it's in a known R2 folder like "artworks/", assume it's a key
        if (input.startsWith("/artworks/") || input.startsWith("/exhibitions/")) {
            return `${R2_WORKER_URL}${input}`;
        }
        return input;
    }

    // 4. Handle Raw Keys (R2 Object Keys)
    // e.g. "artworks/file.jpg" -> Prepend Worker URL
    // We assume any non-http string that doesn't start with / is an R2 key
    // unless it looks like a local relative path (which shouldn't happen much in this app structure)
    return `${R2_WORKER_URL}/${input}`;
}
