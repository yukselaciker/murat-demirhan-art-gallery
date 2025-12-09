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

        if (error) return res.status(500).json(error);

        return res.status(200).json(data);
    }

    if (req.method === "POST") {
        const { title, year, technique, size, imageUrl } = req.body;

        const { data, error } = await supabase.from("artworks").insert([
            {
                title,
                year,
                technique,
                size,
                image_url: imageUrl,
            },
        ]);

        if (error) return res.status(500).json(error);

        return res.status(201).json(data);
    }

    if (req.method === "DELETE") {
        const { id } = req.query;

        const { error } = await supabase.from("artworks").delete().eq("id", id);

        if (error) return res.status(500).json(error);

        return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: "Method Not Allowed" });
}
