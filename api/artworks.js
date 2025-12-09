const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

module.exports = async function handler(req, res) {
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
            const { title, year, technique, size, category, description, status } = req.body;

            // Handle all image field variations
            const imageUrl = req.body.image_url || req.body.imageUrl || req.body.image;

            const insertData = {
                title,
                year: year ? parseInt(year) : null,
                technique,
                size,
                image_url: imageUrl,
                category,
                description: description || null,
                status: status || 'available'
            };

            console.log("POST /api/artworks - inserting:", insertData);

            const { data, error } = await supabase.from("artworks").insert([insertData]).select();

            if (error) {
                console.error("POST /api/artworks error:", error);
                return res.status(500).json({ error: error.message });
            }

            console.log("POST /api/artworks - success:", data);
            return res.status(201).json(data);
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
        res.setHeader("Allow", ["GET", "POST", "DELETE"]);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });

    } catch (e) {
        console.error("UNEXPECTED /api/artworks error:", e);
        return res.status(500).json({ error: "Unexpected server error", details: e.message });
    }
};
