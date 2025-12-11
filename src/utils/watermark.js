// ============================================
// WATERMARK UTILITY - MURAT DEMİRHAN PORTFOLYO
// Canvas tabanlı filigran sistemi
// Görselleri koruma altına alır
// ============================================

// Kullanıcı IP adresi (önbellekleme için)
let cachedUserIP = null;

/**
 * Kullanıcı IP adresini al (ipify API kullanarak)
 * IP adresi filigrana eklenir
 */
export async function getUserIP() {
    if (cachedUserIP) return cachedUserIP;

    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        cachedUserIP = data.ip;
        return cachedUserIP;
    } catch (error) {
        console.log('IP alınamadı:', error);
        return 'IP Bilinmiyor';
    }
}

/**
 * Tarih ve saat bilgisi oluştur
 */
function getDateTime() {
    const now = new Date();
    return now.toLocaleString('tr-TR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Canvas'a filigranlı görsel çiz
 * Bu fonksiyon görseli doğrudan canvas'a çizer ve filigran ekler
 * 
 * @param {string} imageSrc - Görsel URL'i
 * @param {HTMLCanvasElement} canvas - Hedef canvas elementi
 * @param {Object} options - Seçenekler
 */
export async function drawWatermarkedImage(imageSrc, canvas, options = {}) {
    const {
        artistName = '© Murat Demirhan',
        siteDomain = 'muratdemirhan.com',
        artworkTitle = '',
        opacity = 0.12,
        fontSize = 14,
        rotation = -30,
        spacing = 120,
        includeIP = true,
        quality = 'high' // high, low (indirme denendiğinde low kullanılır)
    } = options;

    return new Promise((resolve, reject) => {
        const img = new Image();
        // Cloudflare sıcak bağlantı korumasını aşmak için referrer gönderme
        img.referrerPolicy = 'no-referrer';
        // Localhost/Same-origin için crossOrigin gerekmez, hatta bazen sorun çıkarabilir
        // img.crossOrigin = 'anonymous';

        img.onload = async () => {
            try {
                const ctx = canvas.getContext('2d');

                // Canvas boyutlarını ayarla
                canvas.width = img.width;
                canvas.height = img.height;

                // Görsel kalitesi ayarı (koruma için düşürülebilir)
                if (quality === 'low') {
                    canvas.width = img.width * 0.4;
                    canvas.height = img.height * 0.4;
                }

                // Görseli canvas'a çiz
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Filigran bilgilerini hazırla
                const userIP = includeIP ? await getUserIP() : '';
                const dateTime = getDateTime();

                // Filigran metinleri
                const watermarkLines = [
                    artistName,
                    dateTime,
                    siteDomain
                ];

                if (artworkTitle) {
                    watermarkLines.push(artworkTitle);
                }

                if (userIP && includeIP) {
                    watermarkLines.push(`IP: ${userIP}`);
                }

                // === FİLİGRAN ÇİZİMİ ===
                ctx.save();

                // Filigran stili
                // Filigran: Hafifçe görünür (caydırıcı), düşük kalite modunda belirgin
                const watermarkOpacity = quality === 'low' ? 0.4 : opacity;
                ctx.globalAlpha = watermarkOpacity;
                ctx.font = `${fontSize}px 'Inter', sans-serif`;
                ctx.fillStyle = '#8B4557';
                ctx.textAlign = 'center';

                // Diyagonal repeated filigran
                const diagonal = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);
                const startX = -diagonal / 2;
                const startY = -diagonal / 2;

                // Canvas'ı döndür
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate((rotation * Math.PI) / 180);

                // Filigranları diyagonal şekilde tekrarla
                for (let y = startY; y < diagonal; y += spacing) {
                    for (let x = startX; x < diagonal; x += spacing * 2) {
                        watermarkLines.forEach((line, index) => {
                            ctx.fillText(line, x, y + (index * (fontSize + 4)));
                        });
                    }
                }

                ctx.restore();

                // Düşük kalite modunda ekstra yoğun filigran
                if (quality === 'low') {
                    ctx.save();
                    ctx.globalAlpha = 0.3;
                    ctx.font = `bold ${fontSize * 2}px 'Playfair Display', serif`;
                    ctx.fillStyle = '#8B4557';
                    ctx.textAlign = 'center';
                    ctx.translate(canvas.width / 2, canvas.height / 2);
                    ctx.rotate((-45 * Math.PI) / 180);
                    ctx.fillText('© Murat Demirhan - Korumalı Kopya', 0, 0);
                    ctx.restore();
                }

                resolve(canvas);
            } catch (error) {
                reject(error);
            }
        };

        img.onerror = (error) => {
            reject(error);
        };

        img.src = imageSrc;
    });
}

/**
 * Görsel URL'sinden filigranlı canvas oluştur
 * React component'lerinde kullanılmak üzere
 */
export async function createWatermarkedCanvas(imageSrc, options = {}) {
    const canvas = document.createElement('canvas');
    await drawWatermarkedImage(imageSrc, canvas, options);
    return canvas;
}

/**
 * Canvas'tan düşük kaliteli base64 al
 * DevTools'tan base64 çekilmeye çalışıldığında kullanılır
 */
export function getProtectedBase64(canvas) {
    // Düşük kalite ve ekstra filigran ile
    const ctx = canvas.getContext('2d');

    // Ekstra uyarı metni ekle
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';
    ctx.fillText('İZİNSİZ KOPYALANDI', canvas.width / 2, canvas.height / 2);
    ctx.restore();

    // Düşük kalite JPEG olarak döndür
    return canvas.toDataURL('image/jpeg', 0.3);
}

/**
 * Yüksek yoğunluklu koruma filigranı
 * Screenshot algılandığında kullanılır
 */
export function applyEmergencyWatermark(canvas) {
    const ctx = canvas.getContext('2d');

    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.font = 'bold 48px "Playfair Display", serif';
    ctx.fillStyle = '#8B4557';
    ctx.textAlign = 'center';

    // Merkeze büyük uyarı
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((-30 * Math.PI) / 180);
    ctx.fillText('© MURAT DEMİRHAN', 0, -30);
    ctx.fillText('İZİNSİZ KOPYALANAMAZ', 0, 30);

    ctx.restore();
}

export default {
    getUserIP,
    drawWatermarkedImage,
    createWatermarkedCanvas,
    getProtectedBase64,
    applyEmergencyWatermark
};
