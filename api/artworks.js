import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
    try {
        // CORS Headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');

        if (req.method === 'OPTIONS') {
            return res.status(200).end();
        }

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

        if (req.method === "POST") {
            const { title, year, technique, size, category, description, status, tags } = req.body;

            // Alias fix: Frontend 'image' sends, backend expects 'imageUrl' logic but DB column is image_url
            const imageUrl = req.body.image_url || req.body.imageUrl || req.body.image;

            const { data, error } = await supabase.from("artworks").insert([
                {
                    title,
                    year,
                    technique,
                    size,
                    image_url: imageUrl,
                    category,
                    description,
                    status
                },
            ]);

            if (error) {
                console.error("POST /api/artworks error:", error);
                return res.status(500).json({ error: error.message });
            }

            return res.status(201).json(data);
        }

        if (req.method === "DELETE") {
            const { id } = req.query;

            const { error } = await supabase.from("artworks").delete().eq("id", id);

            if (error) {
                console.error("DELETE /api/artworks error:", error);
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json({ ok: true });
        }

        res.setHeader("Allow", ["GET", "POST", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    } catch (e) {
        console.error("UNEXPECTED /api/artworks error:", e);
        return res.status(500).json({ error: "Unexpected error" });
    }
}
