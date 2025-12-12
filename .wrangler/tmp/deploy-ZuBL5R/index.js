var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// worker/index.ts
var VALID_EMOJIS = ["heart", "fire", "clap", "wow"];
var ALLOWED_ORIGINS = [
  "https://murat-demirhan.vercel.app",
  "https://muratdemirhan.vercel.app",
  "https://muratdemirhan.com",
  "https://www.muratdemirhan.com",
  "http://localhost:5173",
  "http://localhost:3000"
];
function getCorsHeaders(origin) {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400"
  };
}
__name(getCorsHeaders, "getCorsHeaders");
function jsonResponse(data, status = 200, origin = null) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...getCorsHeaders(origin)
    }
  });
}
__name(jsonResponse, "jsonResponse");
function errorResponse(message, status = 500, origin = null) {
  return jsonResponse({ error: message }, status, origin);
}
__name(errorResponse, "errorResponse");
function isAdminAuthorized(request, env) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !env.ADMIN_TOKEN) return false;
  return authHeader === `Bearer ${env.ADMIN_TOKEN}`;
}
__name(isAdminAuthorized, "isAdminAuthorized");
async function generateViewerHash(request, env) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const userAgent = request.headers.get("User-Agent") || "unknown";
  const salt = env.VIEWER_SALT || "default-salt";
  const data = new TextEncoder().encode(`${ip}|${userAgent}|${salt}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(generateViewerHash, "generateViewerHash");
function generateUUID() {
  return crypto.randomUUID();
}
__name(generateUUID, "generateUUID");
var index_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    const origin = request.headers.get("Origin");
    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: getCorsHeaders(origin) });
    }
    try {
      if (path.startsWith("/api/artworks")) {
        return await handleArtworks(request, env, url, origin);
      }
      if (path === "/api/posts" && method === "GET") {
        return await handleGetPosts(env, origin);
      }
      if (path === "/api/admin/posts" && method === "POST") {
        return await handleCreatePost(request, env, origin);
      }
      const deletePostMatch = path.match(/^\/api\/admin\/posts\/([^/]+)$/);
      if (deletePostMatch && method === "DELETE") {
        return await handleDeletePost(request, env, deletePostMatch[1], origin);
      }
      const reactMatch = path.match(/^\/api\/posts\/([^/]+)\/react$/);
      if (reactMatch && method === "POST") {
        return await handleReaction(request, env, reactMatch[1], origin);
      }
      if (path === "/api/admin/upload-url" && method === "POST") {
        return await handleUploadUrl(request, env, origin);
      }
      if (path.startsWith("/images/")) {
        return await handleImages(request, env, path, origin);
      }
      if (path === "/api/admin/verify" && method === "POST") {
        if (isAdminAuthorized(request, env)) {
          return jsonResponse({ valid: true }, 200, origin);
        }
        return jsonResponse({ valid: false, error: "Invalid token" }, 401, origin);
      }
      if (path === "/health" || path === "/") {
        return jsonResponse({
          status: "ok",
          worker: "murat-demirhan-worker",
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }, 200, origin);
      }
      return errorResponse("Not Found", 404, origin);
    } catch (error) {
      console.error("Worker error:", error);
      return errorResponse("Internal Server Error", 500, origin);
    }
  }
};
async function handleArtworks(request, env, url, origin) {
  const method = request.method;
  if (method === "GET") {
    const full = url.searchParams.get("full") === "true";
    const id = url.searchParams.get("id");
    if (id) {
      const result = await env.DB.prepare("SELECT * FROM artworks WHERE id = ?").bind(id).first();
      if (!result) {
        return errorResponse("Artwork not found", 404, origin);
      }
      return jsonResponse(result, 200, origin);
    }
    const columns = full ? "*" : "id, title, image_url, year, technique, size, category, created_at";
    const limit = full ? 1e3 : 50;
    const { results } = await env.DB.prepare(
      `SELECT ${columns} FROM artworks ORDER BY created_at DESC LIMIT ?`
    ).bind(limit).all();
    return jsonResponse(results || [], 200, origin);
  }
  if (method === "POST") {
    if (!isAdminAuthorized(request, env)) {
      return errorResponse("Unauthorized", 401, origin);
    }
    const body = await request.json();
    if (!body.title || !body.title.trim()) {
      return errorResponse("Title is required", 400, origin);
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
    ).first();
    return jsonResponse(result, 201, origin);
  }
  if (method === "PUT") {
    if (!isAdminAuthorized(request, env)) {
      return errorResponse("Unauthorized", 401, origin);
    }
    const id = url.searchParams.get("id");
    if (!id) {
      return errorResponse("id parameter required", 400, origin);
    }
    const body = await request.json();
    const result = await env.DB.prepare(
      `UPDATE artworks 
       SET title = ?, year = ?, technique = ?, size = ?, image_url = ?, category = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?
       RETURNING *`
    ).bind(
      body.title || "",
      body.year || null,
      body.technique || null,
      body.size || null,
      body.image_url || null,
      body.category || null,
      id
    ).first();
    if (!result) {
      return errorResponse("Artwork not found", 404, origin);
    }
    return jsonResponse(result, 200, origin);
  }
  if (method === "DELETE") {
    if (!isAdminAuthorized(request, env)) {
      return errorResponse("Unauthorized", 401, origin);
    }
    const id = url.searchParams.get("id");
    if (!id) {
      return errorResponse("id parameter required", 400, origin);
    }
    await env.DB.prepare("DELETE FROM artworks WHERE id = ?").bind(id).run();
    return jsonResponse({ ok: true, deleted: id }, 200, origin);
  }
  return errorResponse("Method not allowed", 405, origin);
}
__name(handleArtworks, "handleArtworks");
async function handleGetPosts(env, origin) {
  const { results: posts } = await env.DB.prepare(
    `SELECT id, title, body, images_json, created_at, status
     FROM posts
     WHERE status = 'published'
     ORDER BY created_at DESC
     LIMIT 100`
  ).all();
  if (!posts || posts.length === 0) {
    return jsonResponse({ items: [] }, 200, origin);
  }
  const postIds = posts.map((p) => p.id);
  const placeholders = postIds.map(() => "?").join(",");
  const { results: reactions } = await env.DB.prepare(
    `SELECT post_id, emoji, count FROM reactions WHERE post_id IN (${placeholders})`
  ).bind(...postIds).all();
  const reactionsMap = {};
  for (const post of posts) {
    reactionsMap[post.id] = { heart: 0, fire: 0, clap: 0, wow: 0 };
  }
  for (const r of reactions || []) {
    if (reactionsMap[r.post_id]) {
      reactionsMap[r.post_id][r.emoji] = r.count;
    }
  }
  const items = posts.map((post) => ({
    id: post.id,
    title: post.title,
    body: post.body,
    images: post.images_json ? JSON.parse(post.images_json) : [],
    createdAt: post.created_at,
    reactions: reactionsMap[post.id]
  }));
  return jsonResponse({ items }, 200, origin);
}
__name(handleGetPosts, "handleGetPosts");
async function handleCreatePost(request, env, origin) {
  if (!isAdminAuthorized(request, env)) {
    return errorResponse("Unauthorized", 401, origin);
  }
  const body = await request.json();
  const postId = generateUUID();
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const imagesJson = body.images ? JSON.stringify(body.images) : null;
  const status = body.status || "draft";
  await env.DB.prepare(
    `INSERT INTO posts (id, title, body, images_json, created_at, status)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(postId, body.title || null, body.body || null, imagesJson, now, status).run();
  const batch = env.DB.batch([
    env.DB.prepare("INSERT INTO reactions (post_id, emoji, count) VALUES (?, ?, 0)").bind(postId, "heart"),
    env.DB.prepare("INSERT INTO reactions (post_id, emoji, count) VALUES (?, ?, 0)").bind(postId, "fire"),
    env.DB.prepare("INSERT INTO reactions (post_id, emoji, count) VALUES (?, ?, 0)").bind(postId, "clap"),
    env.DB.prepare("INSERT INTO reactions (post_id, emoji, count) VALUES (?, ?, 0)").bind(postId, "wow")
  ]);
  await batch;
  return jsonResponse({
    id: postId,
    title: body.title || null,
    body: body.body || null,
    images: body.images || [],
    createdAt: now,
    status,
    reactions: { heart: 0, fire: 0, clap: 0, wow: 0 }
  }, 201, origin);
}
__name(handleCreatePost, "handleCreatePost");
async function handleDeletePost(request, env, postId, origin) {
  if (!isAdminAuthorized(request, env)) {
    return errorResponse("Unauthorized", 401, origin);
  }
  await env.DB.prepare("DELETE FROM reactions WHERE post_id = ?").bind(postId).run();
  const result = await env.DB.prepare("DELETE FROM posts WHERE id = ?").bind(postId).run();
  if (result.meta.changes === 0) {
    return errorResponse("Post not found", 404, origin);
  }
  return jsonResponse({ ok: true, deleted: postId }, 200, origin);
}
__name(handleDeletePost, "handleDeletePost");
async function handleReaction(request, env, postId, origin) {
  const body = await request.json();
  if (!VALID_EMOJIS.includes(body.emoji)) {
    return errorResponse("Invalid emoji. Must be: heart, fire, clap, wow", 400, origin);
  }
  const emoji = body.emoji;
  const viewerHash = await generateViewerHash(request, env);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const post = await env.DB.prepare("SELECT id FROM posts WHERE id = ?").bind(postId).first();
  if (!post) {
    return errorResponse("Post not found", 404, origin);
  }
  try {
    await env.DB.prepare(
      `INSERT INTO reaction_events (post_id, emoji, viewer_hash, created_at)
       VALUES (?, ?, ?, ?)`
    ).bind(postId, emoji, viewerHash, now).run();
  } catch (error) {
    if (error instanceof Error && error.message.includes("UNIQUE")) {
      return errorResponse("already_reacted", 409, origin);
    }
    throw error;
  }
  await env.DB.prepare(
    `UPDATE reactions SET count = count + 1 WHERE post_id = ? AND emoji = ?`
  ).bind(postId, emoji).run();
  const reaction = await env.DB.prepare(
    `SELECT count FROM reactions WHERE post_id = ? AND emoji = ?`
  ).bind(postId, emoji).first();
  return jsonResponse({
    success: true,
    emoji,
    count: reaction?.count || 1
  }, 200, origin);
}
__name(handleReaction, "handleReaction");
async function handleUploadUrl(request, env, origin) {
  if (!isAdminAuthorized(request, env)) {
    return errorResponse("Unauthorized", 401, origin);
  }
  const body = await request.json();
  const validImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!validImageTypes.includes(body.contentType)) {
    return errorResponse("Invalid content type. Must be an image.", 400, origin);
  }
  const now = /* @__PURE__ */ new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const uuid = generateUUID();
  const ext = body.filename.split(".").pop() || "jpg";
  const key = `feed/${year}/${month}/${uuid}.${ext}`;
  return jsonResponse({
    key,
    // In production, you'd integrate with R2 presigned URLs or a direct upload endpoint
    uploadUrl: `/api/admin/upload?key=${encodeURIComponent(key)}`
  }, 200, origin);
}
__name(handleUploadUrl, "handleUploadUrl");
async function handleImages(request, env, path, origin) {
  const imageKey = path.replace("/images/", "");
  if (request.method === "GET") {
    const object = await env.R2_BUCKET.get(imageKey);
    if (!object) {
      return errorResponse("Image not found", 404, origin);
    }
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("Cache-Control", "public, max-age=31536000");
    return new Response(object.body, { headers });
  }
  if (request.method === "POST") {
    if (!isAdminAuthorized(request, env)) {
      return errorResponse("Unauthorized", 401, origin);
    }
    const formData = await request.formData();
    const fileData = formData.get("file");
    if (!fileData || typeof fileData === "string") {
      return errorResponse("No file provided", 400, origin);
    }
    const file = fileData;
    if (!file.type.startsWith("image/")) {
      return errorResponse("File must be an image", 400, origin);
    }
    await env.R2_BUCKET.put(imageKey, file.stream(), {
      httpMetadata: {
        contentType: file.type
      }
    });
    return jsonResponse({ key: imageKey, url: `/images/${imageKey}` }, 201, origin);
  }
  return errorResponse("Method not allowed", 405, origin);
}
__name(handleImages, "handleImages");
export {
  index_default as default
};
//# sourceMappingURL=index.js.map
