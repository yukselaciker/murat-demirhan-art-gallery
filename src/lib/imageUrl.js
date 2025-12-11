const R2_BASE_URL = "https://r2-images-proxy.yukselaciker.workers.dev";

/**
 * Converts any stored image reference (old full URL or plain key)
 * into the new Worker-based public URL.
 *
 * Supported input formats:
 * - Full old R2 URL: "https://pub-....r2.dev/artworks/xxx.jpg"
 * - Already-converted Worker URL: "https://r2-images-proxy.yukselaciker.workers.dev/artworks/xxx.jpg"
 * - Path with leading slash: "/artworks/xxx.jpg"
 * - Raw key: "artworks/xxx.jpg"
 * 
 * @param {string | null | undefined} input
 * @returns {string}
 */
export function getPublicImageUrl(input) {
    if (!input) return "";

    // If it's already the new worker URL, just return it
    if (input.startsWith(R2_BASE_URL)) {
        return input;
    }

    // If it's a full URL
    if (input.startsWith("http")) {
        // If it's a Supabase URL, Cloudinary, or any other external domain, return as-is
        if (input.includes("supabase.co") || input.includes("cloudinary.com")) {
            return input;
        }

        try {
            const u = new URL(input);
            // Only rewrite if it's the old R2 domain
            if (u.hostname.endsWith("r2.dev") || u.hostname === "pub-4c32ee4587374026bc4113337905ce87.r2.dev") {
                return `${R2_BASE_URL}${u.pathname}`;
            }

            // If it's already the worker URL (handled by startsWith above, but safety check)
            if (u.hostname.includes("workers.dev")) {
                return input;
            }

            // For other domains, return as-is (don't assume we should proxy everything)
            return input;
        } catch (e) {
            console.warn("Error parsing URL in getPublicImageUrl:", input, e);
        }
    }

    // If it's just a key/path, normalize the leading slash
    if (input.startsWith("/")) {
        return `${R2_BASE_URL}${input}`;
    }

    return `${R2_BASE_URL}/${input}`;
}
