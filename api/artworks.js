import { ensureTable, hasDatabaseConnection, query } from './_db.js';

const ensureArtworksTable = () =>
    ensureTable(`
        CREATE TABLE IF NOT EXISTS artworks (
            id SERIAL PRIMARY KEY,
            title TEXT,
            year TEXT,
            technique TEXT,
            size TEXT,
            image_url TEXT,
            category TEXT,
            description TEXT,
            status TEXT,
            tags JSONB DEFAULT '[]'::jsonb,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    `);

function guardConnection(res) {
    if (hasDatabaseConnection()) return true;

    res.status(500).json({
        error:
            'SUPABASE_CONNECTION_STRING (postgresql://postgres:<password>@<host>:5432/postgres) environment variable is missing.',
    });
    return false;
}

export default async function handler(req, res) {
    try {
        // CORS Headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');

        if (req.method === 'OPTIONS') {
            return res.status(200).end();
        }

        if (!guardConnection(res)) return;

        await ensureArtworksTable();

        if (req.method === "GET") {
            const { rows } = await query(
                'SELECT id, title, year, technique, size, image_url, category, description, status, tags FROM artworks ORDER BY id DESC',
            );

            return res.status(200).json(rows);
        }

        if (req.method === "POST") {
            const { title, year, technique, size, category, description, status, tags } = req.body;

            const imageUrl = req.body.image_url || req.body.imageUrl || req.body.image;

            const { rows } = await query(
                `INSERT INTO artworks (title, year, technique, size, image_url, category, description, status, tags)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                 RETURNING id, title, year, technique, size, image_url, category, description, status, tags`,
                [
                    title ?? null,
                    year ?? null,
                    technique ?? null,
                    size ?? null,
                    imageUrl ?? null,
                    category ?? null,
                    description ?? null,
                    status ?? null,
                    Array.isArray(tags) ? tags : [],
                ],
            );

            return res.status(201).json(rows[0]);
        }

        if (req.method === "DELETE") {
            const { id } = req.query;
            await query('DELETE FROM artworks WHERE id = $1', [id]);

            return res.status(200).json({ ok: true });
        }

        res.setHeader("Allow", ["GET", "POST", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    } catch (e) {
        console.error("UNEXPECTED /api/artworks error:", e);
        return res.status(500).json({ error: e.message || "Unexpected error" });
    }
}
