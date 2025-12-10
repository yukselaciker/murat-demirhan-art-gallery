import { createClient } from "@supabase/supabase-js";

// Supabase URL'i POSTGRES_HOST'tan oluştur veya direkt SUPABASE_URL kullan
const supabaseUrl = process.env.SUPABASE_URL ||
    (process.env.POSTGRES_HOST ? `https://${process.env.POSTGRES_HOST.replace('db.', '').replace('.pooler', '')}.supabase.co` : null);

const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.POSTGRES_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // GET - Tüm eserleri getir
        if (req.method === "GET") {
            const { data, error } = await supabase
                .from("artworks")
                .select("*")
                .order("id", { ascending: false });

            if (error) {
                console.error("GET /api/artworks error:", error);
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json(data);
        }

        // POST - Yeni eser ekle
        if (req.method === "POST") {
            console.log("POST /api/artworks - received body keys:", Object.keys(req.body || {}));

            // Check if body exists
            if (!req.body) {
                console.error("POST /api/artworks - no body received");
                return res.status(400).json({ error: "Request body is empty" });
            }

            const { title, year, technique, size, category } = req.body;

            // Handle all image field variations
            const imageUrl = req.body.image_url || req.body.imageUrl || req.body.image;

            // Validate required fields
            if (!title || !title.trim()) {
                return res.status(400).json({ error: "Title is required" });
            }

            // Check image size (base64 data URLs can be very large)
            if (imageUrl && imageUrl.length > 5 * 1024 * 1024) {
                console.error("POST /api/artworks - image too large:", imageUrl.length, "bytes");
                return res.status(400).json({ error: "Image is too large. Please use a smaller image (max 5MB)." });
            }

            const insertData = {
                title: title.trim(),
                year: year ? parseInt(year) : null,
                technique: technique || null,
                size: size || null,
                image_url: imageUrl || null,
                category: category || null
            };

            console.log("POST /api/artworks - inserting:", {
                ...insertData,
                image_url: insertData.image_url ? `[${insertData.image_url.length} chars]` : null
            });

            const { data, error } = await supabase.from("artworks").insert([insertData]).select();

            if (error) {
                console.error("POST /api/artworks error:", error);
                console.error("POST /api/artworks error details:", JSON.stringify(error, null, 2));
                return res.status(500).json({
                    error: error.message,
                    details: error.details || null,
                    hint: error.hint || null,
                    code: error.code || null
                });
            }

            console.log("POST /api/artworks - success:", data);
            return res.status(201).json(data);
        }

        // PUT - Update artwork
        if (req.method === "PUT") {
            const { id } = req.query;
            const { title, year, technique, size, category } = req.body;
            const imageUrl = req.body.image_url || req.body.imageUrl || req.body.image;

            if (!id) {
                return res.status(400).json({ error: "id parameter required" });
            }

            const updateData = {
                title,
                year: year ? parseInt(year) : null,
                technique,
                size,
                image_url: imageUrl,
                category: category || null
            };

            console.log("PUT /api/artworks - updating:", id, updateData);

            const { data, error } = await supabase
                .from("artworks")
                .update(updateData)
                .eq("id", id)
                .select();

            if (error) {
                console.error("PUT /api/artworks error:", error);
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json(data);
        }

        // DELETE - Eser sil
        if (req.method === "DELETE") {
            const { id } = req.query;

            if (!id) {
                return res.status(400).json({ error: "id parameter required" });
            }

            const { error } = await supabase.from("artworks").delete().eq("id", id);

            if (error) {
                console.error("DELETE /api/artworks error:", error);
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json({ ok: true, deleted: id });
        }

        // Method not allowed
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });

    } catch (e) {
        console.error("UNEXPECTED /api/artworks error:", e);
        return res.status(500).json({ error: "Unexpected server error", details: e.message });
    }
};
