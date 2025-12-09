import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === "GET") {
        try {
            const result = await pool.query("SELECT * FROM artworks ORDER BY id DESC");
            return res.status(200).json(result.rows);
        } catch (e) {
            console.error(e);
            return res.status(500).json({ error: e.message });
        }
    }

    if (req.method === "POST") {
        try {
            const { title, year, technique, size, image_url, category, description, status, tags } = req.body;

            // Note: tags is TEXT[] in Postgres, passing array directly usually works with pg
            // But let's be safe. If table has tags TEXT[], passing JS array is fine.

            const result = await pool.query(
                "INSERT INTO artworks(title, year, technique, size, image_url, category, description, status) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
                [title, year, technique, size, image_url, category, description, status]
            );

            return res.status(201).json(result.rows[0]);
        } catch (e) {
            console.error(e);
            return res.status(500).json({ error: e.message });
        }
    }

    if (req.method === "DELETE") {
        try {
            const { id } = req.query;
            await pool.query("DELETE FROM artworks WHERE id=$1", [id]);
            return res.status(200).json({ ok: true });
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    }

    res.status(405).json({ error: "Method Not Allowed" });
}
