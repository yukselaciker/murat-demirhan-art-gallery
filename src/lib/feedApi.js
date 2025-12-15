// ============================================
// FEED API CLIENT - Cloudflare Worker Integration
// API for feed posts and emoji reactions
// Uses localStorage ADMIN_TOKEN for authentication
// ============================================

// API Base URL - uses custom domain to bypass mobile carrier blocking
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://murat-demirhan-worker.yukselaciker.workers.dev';

// Storage key for admin token
const ADMIN_TOKEN_KEY = 'ADMIN_TOKEN';

/**
 * Get admin token from localStorage
 * @returns {string|null}
 */
export function getAdminToken() {
    try {
        return localStorage.getItem(ADMIN_TOKEN_KEY);
    } catch {
        return null;
    }
}

/**
 * Set admin token in localStorage
 * @param {string} token
 */
export function setAdminToken(token) {
    try {
        localStorage.setItem(ADMIN_TOKEN_KEY, token);
    } catch (e) {
        console.error('Failed to save admin token');
    }
}

/**
 * Remove admin token from localStorage
 */
export function removeAdminToken() {
    try {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
    } catch {
        // Ignore errors
    }
}

/**
 * Check if admin token exists
 * @returns {boolean}
 */
export function hasAdminToken() {
    return !!getAdminToken();
}

/**
 * Verify admin token against backend
 * @param {string} token - Token to verify
 * @returns {Promise<{valid: boolean, error?: string}>}
 */
export async function verifyAdminToken(token) {
    try {
        const response = await fetch(`${API_BASE}/api/admin/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        return { valid: response.ok && data.valid, error: data.error };
    } catch (error) {
        return { valid: false, error: 'Bağlantı hatası' };
    }
}

/**
 * @typedef {Object} EmojiCounts
 * @property {number} heart
 * @property {number} fire
 * @property {number} clap
 * @property {number} wow
 */

/**
 * @typedef {Object} Post
 * @property {string} id
 * @property {string|null} title
 * @property {string|null} body
 * @property {string[]} images
 * @property {string} createdAt
 * @property {EmojiCounts} reactions
 */

/**
 * @typedef {'heart'|'fire'|'clap'|'wow'} EmojiType
 */

// Valid emoji types
export const EMOJI_TYPES = ['heart', 'fire', 'clap', 'wow'];

// Emoji display mapping
export const EMOJI_MAP = {
    heart: '❤️',
    fire: '🔥',
    clap: '👏',
    wow: '😮'
};

/**
 * Fetch headers for API requests
 * @param {boolean} isAdmin - Whether this is an admin request
 * @returns {HeadersInit}
 */
function getHeaders(isAdmin = false) {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (isAdmin) {
        const token = getAdminToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    return headers;
}

/**
 * Fetch all published posts
 * @returns {Promise<Post[]>}
 */
export async function fetchPosts() {
    try {
        const response = await fetch(`${API_BASE}/api/posts`, {
            method: 'GET',
            headers: getHeaders(),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error('Failed to fetch posts:', error);
        throw error;
    }
}

/**
 * Delete a post (Admin only)
 * @param {string} postId - Post ID to delete
 * @returns {Promise<{ok: boolean, deleted: string}>}
 */
export async function deletePost(postId) {
    const token = getAdminToken();
    if (!token) {
        throw new Error('Not authenticated');
    }

    try {
        const response = await fetch(`${API_BASE}/api/admin/posts/${postId}`, {
            method: 'DELETE',
            headers: getHeaders(true),
        });

        if (response.status === 401) {
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to delete post:', error);
        throw error;
    }
}

/**
 * React to a post with an emoji
 * @param {string} postId - Post ID
 * @param {EmojiType} emoji - Emoji type
 * @returns {Promise<{success: boolean, emoji: string, count: number, alreadyReacted?: boolean}>}
 */
export async function reactToPost(postId, emoji) {
    try {
        const response = await fetch(`${API_BASE}/api/posts/${postId}/react`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ emoji }),
        });

        // Handle already reacted case
        if (response.status === 409) {
            const data = await response.json();
            return { success: false, emoji, count: 0, alreadyReacted: true, error: data.error };
        }

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to react to post:', error);
        throw error;
    }
}

/**
 * Create a new post (admin only)
 * @param {{title?: string, body?: string, images?: string[], status?: 'published'|'draft'}} postData
 * @returns {Promise<Post>}
 */
export async function createPost(postData) {
    const token = getAdminToken();
    if (!token) {
        throw new Error('Not authenticated');
    }

    try {
        const response = await fetch(`${API_BASE}/api/admin/posts`, {
            method: 'POST',
            headers: getHeaders(true),
            body: JSON.stringify(postData),
        });

        if (response.status === 401) {
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `API error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to create post:', error);
        throw error;
    }
}

/**
 * Get presigned upload URL for image (admin only)
 * @param {string} filename - Original filename
 * @param {string} contentType - MIME type
 * @returns {Promise<{key: string, uploadUrl: string}>}
 */
export async function getUploadUrl(filename, contentType) {
    const token = getAdminToken();
    if (!token) {
        throw new Error('Not authenticated');
    }

    try {
        const response = await fetch(`${API_BASE}/api/admin/upload-url`, {
            method: 'POST',
            headers: getHeaders(true),
            body: JSON.stringify({ filename, contentType }),
        });

        if (response.status === 401) {
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `API error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to get upload URL:', error);
        throw error;
    }
}

/**
 * Upload image to R2 via worker (admin only)
 * @param {File} file - Image file
 * @param {string} key - R2 key from getUploadUrl
 * @returns {Promise<{key: string, url: string}>}
 */
export async function uploadImage(file, key) {
    const token = getAdminToken();
    if (!token) {
        throw new Error('Not authenticated');
    }

    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE}/images/${key}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (response.status === 401) {
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Upload failed: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to upload image:', error);
        throw error;
    }
}

/**
 * Get full image URL from R2 key
 * @param {string} key - R2 key
 * @returns {string}
 */
export function getImageUrl(key) {
    if (!key) return '';
    if (key.startsWith('http')) return key;
    return `${API_BASE}/images/${key}`;
}
