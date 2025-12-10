import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // GET - List all messages
    if (req.method === 'GET') {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('GET /api/messages error:', error);
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json(data || []);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // PUT - Mark as read/replied
    if (req.method === 'PUT') {
        try {
            const { id } = req.query;
            const { read, replied } = req.body;

            if (!id) {
                return res.status(400).json({ error: 'Message ID is required' });
            }

            const updateData = {};
            if (read !== undefined) updateData.read = read;
            if (replied !== undefined) updateData.replied = replied;

            const { data, error } = await supabase
                .from('messages')
                .update(updateData)
                .eq('id', id)
                .select();

            if (error) {
                console.error('PUT /api/messages error:', error);
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json(data[0]);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // DELETE - Remove message
    if (req.method === 'DELETE') {
        try {
            const { id } = req.query;

            if (!id) {
                return res.status(400).json({ error: 'Message ID is required' });
            }

            const { error } = await supabase
                .from('messages')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('DELETE /api/messages error:', error);
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json({ success: true });
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
