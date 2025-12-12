/**
 * Murat Demirhan Art Gallery - Cloudflare Worker
 * D1 Database + R2 Storage Integration
 * Features: Artworks CRUD, Feed Posts with Emoji Reactions
 */

interface Env {
    DB: D1Database;
    R2_BUCKET: R2Bucket;
    ADMIN_TOKEN?: string;
    VIEWER_SALT?: string;
    ENV: string;
}

// ============ TYPES ============

interface Artwork {
    id: number;
    title: string;
    year: number | null;
    technique: string | null;
    size: string | null;
    image_url: string | null;
    category: string | null;
    created_at: string;
    updated_at: string;
}

interface Post {
    id: string;
    title: string | null;
    body: string | null;
    images_json: string | null;
    created_at: string;
    status: 'published' | 'draft';
}

interface PostWithReactions extends Post {
    reactions: EmojiCounts;
}

interface EmojiCounts {
    heart: number;
    fire: number;
    clap: number;
    wow: number;
}

type EmojiType = 'heart' | 'fire' | 'clap' | 'wow';
const VALID_EMOJIS: EmojiType[] = ['heart', 'fire', 'clap', 'wow'];

// ============ CORS CONFIG ============

const ALLOWED_ORIGINS = [
    'https://murat-demirhan.vercel.app',
    'https://muratdemirhan.com',
    'http://localhost:5173',
    'http://localhost:3000',
];

function getCorsHeaders(origin: string | null): Record<string, string> {
    const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
    return {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
    };
}

// ============ RESPONSE HELPERS ============

function jsonResponse(data: unknown, status = 200, origin: string | null = null): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...getCorsHeaders(origin),
        },
    });
}

function errorResponse(message: string, status = 500, origin: string | null = null): Response {
    return jsonResponse({ error: message }, status, origin);
}

// ============ AUTH HELPERS ============

function isAdminAuthorized(request: Request, env: Env): boolean {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !env.ADMIN_TOKEN) return false;
    return authHeader === `Bearer ${env.ADMIN_TOKEN}`;
}

async function generateViewerHash(request: Request, env: Env): Promise<string> {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const userAgent = request.headers.get('User-Agent') || 'unknown';
    const salt = env.VIEWER_SALT || 'default-salt';

    const data = new TextEncoder().encode(`${ip}|${userAgent}|${salt}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateUUID(): string {
    return crypto.randomUUID();
}

// ============ MAIN HANDLER ============

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;
        const origin = request.headers.get('Origin');

        // Handle CORS preflight
        if (method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: getCorsHeaders(origin) });
        }

        try {
            // ============ ARTWORKS API ============
            if (path.startsWith('/api/artworks')) {
                return await handleArtworks(request, env, url, origin);
            }

            // ============ FEED/POSTS API ============
            if (path === '/api/posts' && method === 'GET') {
                return await handleGetPosts(env, origin);
            }

            if (path === '/api/admin/posts' && method === 'POST') {
                return await handleCreatePost(request, env, origin);
            }

            // POST /api/posts/:id/react
            const reactMatch = path.match(/^\/api\/posts\/([^/]+)\/react$/);
            if (reactMatch && method === 'POST') {
                return await handleReaction(request, env, reactMatch[1], origin);
            }

            // POST /api/admin/upload-url
            if (path === '/api/admin/upload-url' && method === 'POST') {
                return await handleUploadUrl(request, env, origin);
            }

            // ============ R2 IMAGE SERVE ============
            if (path.startsWith('/images/')) {
                return await handleImages(request, env, path, origin);
            }

            // ============ HEALTH CHECK ============
            if (path === '/health' || path === '/') {
                return jsonResponse({
                    status: 'ok',
                    worker: 'murat-demirhan-worker',
                    timestamp: new Date().toISOString(),
                }, 200, origin);
            }

            return errorResponse('Not Found', 404, origin);
        } catch (error) {
            console.error('Worker error:', error);
            return errorResponse('Internal Server Error', 500, origin);
        }
    },
};

// ============ ARTWORKS HANDLER ============

async function handleArtworks(
    request: Request,
    env: Env,
    url: URL,
    origin: string | null
): Promise<Response> {
    const method = request.method;

    // GET - List all artworks
    if (method === 'GET') {
        const full = url.searchParams.get('full') === 'true';
        const id = url.searchParams.get('id');

        if (id) {
            const result = await env.DB.prepare('SELECT * FROM artworks WHERE id = ?')
                .bind(id)
                .first<Artwork>();

            if (!result) {
                return errorResponse('Artwork not found', 404, origin);
            }
            return jsonResponse(result, 200, origin);
        }

        const columns = full ? '*' : 'id, title, image_url, year, technique, size, category, created_at';
        const limit = full ? 1000 : 50;

        const { results } = await env.DB.prepare(
            `SELECT ${columns} FROM artworks ORDER BY created_at DESC LIMIT ?`
        ).bind(limit).all<Artwork>();

        return jsonResponse(results || [], 200, origin);
    }

    // POST - Create new artwork (ADMIN ONLY)
    if (method === 'POST') {
        if (!isAdminAuthorized(request, env)) {
            return errorResponse('Unauthorized', 401, origin);
        }

        const body = await request.json<Partial<Artwork>>();

        if (!body.title || !body.title.trim()) {
            return errorResponse('Title is required', 400, origin);
        }

        const result = await env.DB.prepare(
            `INSERT INTO artworks (title, year, technique, size, image_url, category)
       VALUES (?, ?, ?, ?, ?, ?)
       RETURNING *`
        ).bind(
            body.title.trim(),
            body.year || null,
            body.technique || null,
            body.size || null,
            body.image_url || null,
            body.category || null
        ).first<Artwork>();

        return jsonResponse(result, 201, origin);
    }

    // PUT - Update artwork (ADMIN ONLY)
    if (method === 'PUT') {
        if (!isAdminAuthorized(request, env)) {
            return errorResponse('Unauthorized', 401, origin);
        }

        const id = url.searchParams.get('id');
        if (!id) {
            return errorResponse('id parameter required', 400, origin);
        }

        const body = await request.json<Partial<Artwork>>();

        const result = await env.DB.prepare(
            `UPDATE artworks 
       SET title = ?, year = ?, technique = ?, size = ?, image_url = ?, category = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?
       RETURNING *`
        ).bind(
            body.title || '',
            body.year || null,
            body.technique || null,
            body.size || null,
            body.image_url || null,
            body.category || null,
            id
        ).first<Artwork>();

        if (!result) {
            return errorResponse('Artwork not found', 404, origin);
        }

        return jsonResponse(result, 200, origin);
    }

    // DELETE - Remove artwork (ADMIN ONLY)
    if (method === 'DELETE') {
        if (!isAdminAuthorized(request, env)) {
            return errorResponse('Unauthorized', 401, origin);
        }

        const id = url.searchParams.get('id');
        if (!id) {
            return errorResponse('id parameter required', 400, origin);
        }

        await env.DB.prepare('DELETE FROM artworks WHERE id = ?').bind(id).run();
        return jsonResponse({ ok: true, deleted: id }, 200, origin);
    }

    return errorResponse('Method not allowed', 405, origin);
}

// ============ FEED POSTS HANDLERS ============

async function handleGetPosts(env: Env, origin: string | null): Promise<Response> {
    // Get published posts
    const { results: posts } = await env.DB.prepare(
        `SELECT id, title, body, images_json, created_at, status
     FROM posts
     WHERE status = 'published'
     ORDER BY created_at DESC
     LIMIT 100`
    ).all<Post>();

    if (!posts || posts.length === 0) {
        return jsonResponse({ items: [] }, 200, origin);
    }

    // Get reactions for all posts
    const postIds = posts.map(p => p.id);
    const placeholders = postIds.map(() => '?').join(',');

    const { results: reactions } = await env.DB.prepare(
        `SELECT post_id, emoji, count FROM reactions WHERE post_id IN (${placeholders})`
    ).bind(...postIds).all<{ post_id: string; emoji: EmojiType; count: number }>();

    // Build reactions map
    const reactionsMap: Record<string, EmojiCounts> = {};
    for (const post of posts) {
        reactionsMap[post.id] = { heart: 0, fire: 0, clap: 0, wow: 0 };
    }
    for (const r of reactions || []) {
        if (reactionsMap[r.post_id]) {
            reactionsMap[r.post_id][r.emoji] = r.count;
        }
    }

    // Format response
    const items = posts.map(post => ({
        id: post.id,
        title: post.title,
        body: post.body,
        images: post.images_json ? JSON.parse(post.images_json) : [],
        createdAt: post.created_at,
        reactions: reactionsMap[post.id],
    }));

    return jsonResponse({ items }, 200, origin);
}

async function handleCreatePost(
    request: Request,
    env: Env,
    origin: string | null
): Promise<Response> {
    // Admin auth check
    if (!isAdminAuthorized(request, env)) {
        return errorResponse('Unauthorized', 401, origin);
    }

    const body = await request.json<{
        title?: string;
        body?: string;
        images?: string[];
        status?: 'published' | 'draft';
    }>();

    const postId = generateUUID();
    const now = new Date().toISOString();
    const imagesJson = body.images ? JSON.stringify(body.images) : null;
    const status = body.status || 'draft';

    // Insert post
    await env.DB.prepare(
        `INSERT INTO posts (id, title, body, images_json, created_at, status)
     VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(postId, body.title || null, body.body || null, imagesJson, now, status).run();

    // Initialize emoji reactions with 0 count
    const batch = env.DB.batch([
        env.DB.prepare('INSERT INTO reactions (post_id, emoji, count) VALUES (?, ?, 0)').bind(postId, 'heart'),
        env.DB.prepare('INSERT INTO reactions (post_id, emoji, count) VALUES (?, ?, 0)').bind(postId, 'fire'),
        env.DB.prepare('INSERT INTO reactions (post_id, emoji, count) VALUES (?, ?, 0)').bind(postId, 'clap'),
        env.DB.prepare('INSERT INTO reactions (post_id, emoji, count) VALUES (?, ?, 0)').bind(postId, 'wow'),
    ]);
    await batch;

    return jsonResponse({
        id: postId,
        title: body.title || null,
        body: body.body || null,
        images: body.images || [],
        createdAt: now,
        status,
        reactions: { heart: 0, fire: 0, clap: 0, wow: 0 },
    }, 201, origin);
}

async function handleReaction(
    request: Request,
    env: Env,
    postId: string,
    origin: string | null
): Promise<Response> {
    const body = await request.json<{ emoji: string }>();

    // Validate emoji
    if (!VALID_EMOJIS.includes(body.emoji as EmojiType)) {
        return errorResponse('Invalid emoji. Must be: heart, fire, clap, wow', 400, origin);
    }

    const emoji = body.emoji as EmojiType;
    const viewerHash = await generateViewerHash(request, env);
    const now = new Date().toISOString();

    // Check if post exists
    const post = await env.DB.prepare('SELECT id FROM posts WHERE id = ?').bind(postId).first();
    if (!post) {
        return errorResponse('Post not found', 404, origin);
    }

    // Try to insert reaction event (anti-spam)
    try {
        await env.DB.prepare(
            `INSERT INTO reaction_events (post_id, emoji, viewer_hash, created_at)
       VALUES (?, ?, ?, ?)`
        ).bind(postId, emoji, viewerHash, now).run();
    } catch (error: unknown) {
        // UNIQUE constraint violation = already reacted
        if (error instanceof Error && error.message.includes('UNIQUE')) {
            return errorResponse('already_reacted', 409, origin);
        }
        throw error;
    }

    // Increment reaction count
    await env.DB.prepare(
        `UPDATE reactions SET count = count + 1 WHERE post_id = ? AND emoji = ?`
    ).bind(postId, emoji).run();

    // Get updated count
    const reaction = await env.DB.prepare(
        `SELECT count FROM reactions WHERE post_id = ? AND emoji = ?`
    ).bind(postId, emoji).first<{ count: number }>();

    return jsonResponse({
        success: true,
        emoji,
        count: reaction?.count || 1,
    }, 200, origin);
}

// ============ UPLOAD URL HANDLER ============

async function handleUploadUrl(
    request: Request,
    env: Env,
    origin: string | null
): Promise<Response> {
    // Admin auth check
    if (!isAdminAuthorized(request, env)) {
        return errorResponse('Unauthorized', 401, origin);
    }

    const body = await request.json<{ filename: string; contentType: string }>();

    // Validate content type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validImageTypes.includes(body.contentType)) {
        return errorResponse('Invalid content type. Must be an image.', 400, origin);
    }

    // Generate R2 key under feed/ path
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const uuid = generateUUID();
    const ext = body.filename.split('.').pop() || 'jpg';
    const key = `feed/${year}/${month}/${uuid}.${ext}`;

    // Note: For presigned URLs, you'd typically use R2's presigned URL feature
    // Since Workers can't generate presigned URLs directly, we return the key
    // and the frontend uploads via a separate endpoint

    return jsonResponse({
        key,
        // In production, you'd integrate with R2 presigned URLs or a direct upload endpoint
        uploadUrl: `/api/admin/upload?key=${encodeURIComponent(key)}`,
    }, 200, origin);
}

// ============ IMAGES HANDLER (R2) ============

async function handleImages(
    request: Request,
    env: Env,
    path: string,
    origin: string | null
): Promise<Response> {
    const imageKey = path.replace('/images/', '');

    if (request.method === 'GET') {
        const object = await env.R2_BUCKET.get(imageKey);

        if (!object) {
            return errorResponse('Image not found', 404, origin);
        }

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);
        headers.set('Cache-Control', 'public, max-age=31536000');

        return new Response(object.body, { headers });
    }

    // POST - Upload image (admin only)
    if (request.method === 'POST') {
        if (!isAdminAuthorized(request, env)) {
            return errorResponse('Unauthorized', 401, origin);
        }

        const formData = await request.formData();
        const fileData = formData.get('file');

        if (!fileData || typeof fileData === 'string') {
            return errorResponse('No file provided', 400, origin);
        }

        // Cast to File after type guard
        const file = fileData as unknown as File;

        // Validate it's an image
        if (!file.type.startsWith('image/')) {
            return errorResponse('File must be an image', 400, origin);
        }

        await env.R2_BUCKET.put(imageKey, file.stream(), {
            httpMetadata: {
                contentType: file.type,
            },
        });

        return jsonResponse({ key: imageKey, url: `/images/${imageKey}` }, 201, origin);
    }

    return errorResponse('Method not allowed', 405, origin);
}
