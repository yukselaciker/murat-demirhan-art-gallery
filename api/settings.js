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
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { key } = req.query;

        // GET - Fetch settings by key
        if (req.method === "GET") {
            if (!key) {
                // Return all settings if no key specified
                const { data, error } = await supabase
                    .from("site_settings")
                    .select("*");

                if (error) {
                    console.error("GET /api/settings error:", error);
                    return res.status(500).json({ error: error.message });
                }

                // Convert array to object keyed by 'key' field
                const result = {};
                (data || []).forEach(row => {
                    result[row.key] = row.value;
                });

                // Vercel Edge Caching - Cache REMOVED for real-time admin updates
                res.setHeader('Cache-Control', 'no-store, max-age=0');

                return res.status(200).json(result);
            }

            // Fetch single setting by key
            const { data, error } = await supabase
                .from("site_settings")
                .select("*")
                .eq("key", key)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
                console.error("GET /api/settings error:", error);
                return res.status(500).json({ error: error.message });
            }

            // Return value or empty object if not found
            return res.status(200).json(data?.value || {});
        }

        // PUT - Update settings by key
        if (req.method === "PUT") {
            if (!key) {
                return res.status(400).json({ error: "key parameter required" });
            }

            const value = req.body;

            console.log(`PUT /api/settings?key=${key} - updating:`, value);

            // Upsert: insert if not exists, update if exists
            const { data, error } = await supabase
                .from("site_settings")
                .upsert({
                    key,
                    value,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'key'
                })
                .select();

            if (error) {
                console.error("PUT /api/settings error:", error);
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json(data?.[0]?.value || value);
        }

        // Method not allowed
        res.setHeader("Allow", ["GET", "PUT"]);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });

    } catch (e) {
        console.error("UNEXPECTED /api/settings error:", e);
        return res.status(500).json({ error: "Unexpected server error", details: e.message });
    }
};
