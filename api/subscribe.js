import { createClient } from "@supabase/supabase-js";

// Supabase URL'i POSTGRES_HOST'tan oluştur veya direkt SUPABASE_URL kullan
const supabaseUrl = process.env.SUPABASE_URL ||
    (process.env.POSTGRES_HOST ? `https://${process.env.POSTGRES_HOST.replace('db.', '').replace('.pooler', '')}.supabase.co` : null);

const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.POSTGRES_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        try {
            const { email } = req.body;

            // Validation
            if (!email) {
                return res.status(400).json({ error: 'Email is required' });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }

            // Check if already subscribed
            const { data: existing } = await supabase
                .from('subscribers')
                .select('id')
                .eq('email', email)
                .single();

            if (existing) {
                return res.status(200).json({
                    success: true,
                    message: 'Already subscribed'
                });
            }

            // Add subscriber
            const { error } = await supabase
                .from('subscribers')
                .insert([{ email }]);

            if (error) {
                console.error('Subscribe error:', error);
                return res.status(500).json({ error: 'Failed to subscribe' });
            }

            return res.status(200).json({
                success: true,
                message: 'Successfully subscribed'
            });

        } catch (error) {
            console.error('Subscribe error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
