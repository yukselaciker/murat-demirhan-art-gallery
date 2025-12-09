import { ensureTable, hasDatabaseConnection, query } from './_db.js';

const SINGLETON_ID = 'singleton';

async function guardConnection(res) {
    if (hasDatabaseConnection()) return true;

    res.status(500).json({
        error:
            'SUPABASE_CONNECTION_STRING (postgresql://postgres:<password>@<host>:5432/postgres) environment variable is missing.',
    });
    return false;
}

async function ensureSiteDataTable() {
    await ensureTable(`
        CREATE TABLE IF NOT EXISTS site_data (
            id TEXT PRIMARY KEY,
            payload JSONB NOT NULL DEFAULT '{}'::jsonb,
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
    `);
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (!(await guardConnection(res))) return;

        await ensureSiteDataTable();

        if (req.method === 'GET') {
            const { rows } = await query('SELECT payload FROM site_data WHERE id = $1', [SINGLETON_ID]);

            if (!rows.length) {
                await query(
                    `INSERT INTO site_data (id, payload) VALUES ($1, $2)
                     ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()`,
                    [SINGLETON_ID, {}],
                );
                return res.status(200).json({});
            }

            return res.status(200).json(rows[0].payload || {});
        }

        if (req.method === 'PUT' || req.method === 'POST') {
            const payload = req.body && typeof req.body === 'object' ? req.body : {};

            await query(
                `INSERT INTO site_data (id, payload) VALUES ($1, $2)
                 ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()`,
                [SINGLETON_ID, payload],
            );

            return res.status(200).json({ ok: true });
        }

        if (req.method === 'DELETE') {
            await query('DELETE FROM site_data WHERE id = $1', [SINGLETON_ID]);
            return res.status(200).json({ ok: true });
        }

        res.setHeader('Allow', ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    } catch (e) {
        console.error('UNEXPECTED /api/site-data error:', e);
        return res.status(500).json({ error: e.message || 'Unexpected error' });
    }
}
