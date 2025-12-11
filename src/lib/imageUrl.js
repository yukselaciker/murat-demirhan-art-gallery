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

    // If it's a full URL (old R2 URL, or anything else), take only the path
    if (input.startsWith("http")) {
        try {
            const u = new URL(input);
            // If it's the old R2 domain, we definitely want to replace the domain
            // If it's some other domain, this logic assumes we want to proxy it too, 
            // or it might be a mistake. Given the requirements, we treat it as an old R2 URL.
            return `${R2_BASE_URL}${u.pathname}`;
        } catch (e) {
            // If URL parsing fails, fall through to key handling
            console.warn("Error parsing URL in getPublicImageUrl:", input, e);
        }
    }

    // If it's just a key/path, normalize the leading slash
    if (input.startsWith("/")) {
        return `${R2_BASE_URL}${input}`;
    }

    return `${R2_BASE_URL}/${input}`;
}
