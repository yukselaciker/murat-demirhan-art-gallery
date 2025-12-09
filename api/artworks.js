import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
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
        const { title, year, technique, size, imageUrl } = req.body;

        // Handle all image field variations
        const finalImageUrl = req.body.image_url || imageUrl || req.body.image;

        const { data, error } = await supabase.from("artworks").insert([
            {
                title,
                year,
                technique,
                size,
                image_url: finalImageUrl,
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
}
