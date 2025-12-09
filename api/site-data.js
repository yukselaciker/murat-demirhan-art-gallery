// api/site-data.js
// Tüm site verilerini tek seferde çekmek için (Load performansını artırır)

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        // TODO: Supabase'den tüm tabloları çekip birleştirin
        // const [artworks, exhibitions, cv] = await Promise.all([...])

        const mockData = {
            artworks: [], // api/artworks.js'den gelmeli
            exhibitions: [],
            cv: {},
            contactInfo: {}
        };

        return res.status(200).json(mockData);
    }

    return res.status(405).json({ error: 'Method get only' });
}
