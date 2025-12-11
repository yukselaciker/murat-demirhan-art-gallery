// rescue.js - Base64 Resim Kurtarma Scripti
// Bu script veritabanındaki base64 formatındaki resimleri dosya olarak indirir

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// --- AYARLAR ---
// Supabase URL ve Key'inizi buraya yazın
const SUPABASE_URL = "https://yyggrshzgyivaywytmlj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5Z2dyc2h6Z3lpdmF5d3l0bWxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzODUzODEsImV4cCI6MjA4MDk2MTM4MX0.ll3P0jQMfQR3HBiFGv7WD5BH1JppOogI0bq8hOFQR_w";

// Klasör yoksa oluştur
const DOWNLOAD_FOLDER = './kurtarilan_resimler';
if (!fs.existsSync(DOWNLOAD_FOLDER)) {
    fs.mkdirSync(DOWNLOAD_FOLDER);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function downloadImages() {
    console.log("🔍 Veritabanından resim verileri çekiliyor...\n");

    // Tüm artworks kayıtlarını çek
    const { data: artworks, error } = await supabase
        .from('artworks')
        .select('id, title, image_url');

    if (error) {
        console.error("❌ Veritabanı hatası:", error);
        return;
    }

    console.log(`📦 Toplam ${artworks.length} eser bulundu.\n`);

    let savedCount = 0;
    let skippedCount = 0;

    for (const item of artworks) {
        // Sadece 'data:image' ile başlayanları kurtaracağız
        if (item.image_url && item.image_url.startsWith('data:image')) {
            try {
                // 1. Base64 başlığını ayıkla (data:image/jpeg;base64, kısmını at)
                const matches = item.image_url.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

                if (!matches || matches.length !== 3) {
                    console.log(`⚠️ Atlandı (Format dışı): ${item.title}`);
                    continue;
                }

                const type = matches[1]; // image/jpeg
                const base64Data = matches[2]; // Resim verisi
                const extension = type.split('/')[1] || 'jpg'; // jpeg veya png

                // 2. Dosya ismini temizle
                const safeTitle = (item.title || 'untitled')
                    .replace(/[^a-z0-9]/gi, '_')
                    .toLowerCase()
                    .substring(0, 50); // Max 50 karakter

                const fileName = `${item.id}-${safeTitle}.${extension}`;
                const filePath = path.join(DOWNLOAD_FOLDER, fileName);

                // 3. Base64'ü buffer'a çevir ve dosyaya yaz
                const buffer = Buffer.from(base64Data, 'base64');
                fs.writeFileSync(filePath, buffer);

                console.log(`✅ Kurtarıldı: ${fileName} (${Math.round(buffer.length / 1024)} KB)`);
                savedCount++;

            } catch (err) {
                console.error(`❌ Hata (${item.title}):`, err.message);
            }
        } else if (item.image_url && item.image_url.startsWith('http')) {
            console.log(`⏩ Zaten URL formatında: ${item.title}`);
            skippedCount++;
        } else {
            console.log(`⏩ Resim yok: ${item.title || item.id}`);
            skippedCount++;
        }
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`🎉 İŞLEM TAMAMLANDI!`);
    console.log(`${'='.repeat(50)}`);
    console.log(`✅ Kurtarılan: ${savedCount} resim`);
    console.log(`⏩ Atlanan: ${skippedCount} kayıt`);
    console.log(`📁 Konum: ${path.resolve(DOWNLOAD_FOLDER)}`);
}

downloadImages();
