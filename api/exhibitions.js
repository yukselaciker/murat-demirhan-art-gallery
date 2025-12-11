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
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // GET - Fetch all exhibitions (OPTIMIZED)
        if (req.method === "GET") {
            const { data, error } = await supabase
                .from("exhibitions")  // Query the actual table
                .select("id, title, year, city, venue, type, description")
                .order("year", { ascending: false })
                .limit(50);

            if (error) {
                console.error("GET /api/exhibitions error:", error);
                return res.status(500).json({ error: error.message });
            }

            // Vercel Edge Caching - 1 hour cache
            res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=300');

            return res.status(200).json(data || []);
        }

        // POST - Add new exhibition
        if (req.method === "POST") {
            const { title, year, city, venue, type, description } = req.body;

            const insertData = {
                title,
                year: year ? parseInt(year) : null,
                city,
                venue,
                type: type || 'Kişisel Sergi',
                description: description || null
            };

            console.log("POST /api/exhibitions - inserting:", insertData);

            const { data, error } = await supabase
                .from("exhibitions")
                .insert([insertData])
                .select();

            if (error) {
                console.error("POST /api/exhibitions error:", error);
                return res.status(500).json({ error: error.message });
            }

            return res.status(201).json(data);
        }

        // PUT - Update exhibition
        if (req.method === "PUT") {
            const { id } = req.query;
            const { title, year, city, venue, type, description } = req.body;

            if (!id) {
                return res.status(400).json({ error: "id parameter required" });
            }

            const updateData = {
                title,
                year: year ? parseInt(year) : null,
                city,
                venue,
                type,
                description
            };

            const { data, error } = await supabase
                .from("exhibitions")
                .update(updateData)
                .eq("id", id)
                .select();

            if (error) {
                console.error("PUT /api/exhibitions error:", error);
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json(data);
        }

        // DELETE - Remove exhibition
        if (req.method === "DELETE") {
            const { id } = req.query;

            if (!id) {
                return res.status(400).json({ error: "id parameter required" });
            }

            const { error } = await supabase
                .from("exhibitions")
                .delete()
                .eq("id", id);

            if (error) {
                console.error("DELETE /api/exhibitions error:", error);
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json({ ok: true, deleted: id });
        }

        // Method not allowed
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });

    } catch (e) {
        console.error("UNEXPECTED /api/exhibitions error:", e);
        return res.status(500).json({ error: "Unexpected server error", details: e.message });
    }
};
