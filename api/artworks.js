// api/artworks.js
// Vercel Serverless Function
// Not: Bu fonksiyon her çalıştığında bellek sıfırlanır. Kalıcılık için bir veritabanına (Supabase, MongoDB) bağlanmalıdır.

// DEMO: Bellek içi veri (Serverless ortamında istekler arası korunmaz!)
let artworks = [
    {
        id: 1,
        title: 'Bisikletli Çocuk',
        year: 2024,
        technique: 'Tuval üzerine yağlı boya',
        size: '60x80 cm',
        category: 'figuratif',
        tags: ['çocuk', 'bisiklet', 'deniz', 'duvar', 'masumiyet'],
        description: 'Deniz kenarındaki taş duvarın önünde, mavi bisikletiyle duran ve parmağıyla ufku işaret eden bir çocuk.',
        status: 'collection',
        // image: ... (URL olmalı)
    },
    // Diğer varsayılan veriler...
];

export default function handler(req, res) {
    const method = req.method;

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (method === 'OPTIONS') {
        return res.status(200).end();
    }

    // GET: Tüm eserleri getir
    if (method === 'GET') {
        // TODO: const { data } = await supabase.from('artworks').select('*');
        return res.status(200).json(artworks);
    }

    // POST: Yeni eser ekle
    if (method === 'POST') {
        const body = req.body || {};
        const newArtwork = {
            id: Date.now(), // Basit ID
            ...body
        };

        // TODO: await supabase.from('artworks').insert([newArtwork]);
        artworks.push(newArtwork);

        return res.status(201).json(newArtwork);
    }

    // PUT: Eser güncelle
    if (method === 'PUT') {
        const { id } = req.query; // /api/artworks?id=123
        const body = req.body || {};
        const numericId = Number(id);

        // TODO: await supabase.from('artworks').update(body).eq('id', numericId);
        artworks = artworks.map(a => (a.id === numericId ? { ...a, ...body } : a));

        return res.status(200).json({ success: true });
    }

    // DELETE: Eser sil
    if (method === 'DELETE') {
        const { id } = req.query;
        const numericId = Number(id);

        // TODO: await supabase.from('artworks').delete().eq('id', numericId);
        artworks = artworks.filter(a => a.id !== numericId);

        return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
