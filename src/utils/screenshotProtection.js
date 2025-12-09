// ============================================
// SCREENSHOT PROTECTION - MURAT DEMİRHAN PORTFOLYO
// Ekran görüntüsü algılama ve koruma sistemi
// ============================================

import { getUserIP } from './watermark';

// Screenshot algılama için state
let screenshotProtectionActive = false;
let lastVisibilityChange = Date.now();

/**
 * Screenshot overlay'ini göster
 * Ekranda tüm görsellerin üzerine yoğun filigran bindirir
 */
function showScreenshotOverlay() {
    const overlay = document.getElementById('screenshot-overlay');
    if (overlay) {
        overlay.classList.add('active');

        // 2.5 saniye sonra gizle
        setTimeout(() => {
            overlay.classList.remove('active');
        }, 2500);
    }
}

/**
 * Konsola screenshot girişimi logla
 */
async function logScreenshotAttempt(method) {
    const timestamp = new Date().toLocaleString('tr-TR');
    const userIP = await getUserIP();

    console.log(
        `%c📸 Screenshot girişimi algılandı!`,
        'color: #e53e3e; font-size: 16px; font-weight: bold;'
    );
    console.log(`   Yöntem: ${method}`);
    console.log(`   Zaman: ${timestamp}`);
    console.log(`   IP: ${userIP}`);

    // Opsiyonel: Backend'e rapor gönder
    // await reportScreenshotAttempt({ method, timestamp, userIP });
}

/**
 * Visibility change event handler
 * Kullanıcı sekmeden çıktığında veya pencereyi değiştirdiğinde
 */
function handleVisibilityChange() {
    const now = Date.now();

    // 100ms içinde visibility değişirse screenshot olabilir
    if (document.hidden && (now - lastVisibilityChange < 100)) {
        showScreenshotOverlay();
        logScreenshotAttempt('Visibility Change (hızlı)');
    }

    lastVisibilityChange = now;

    // Sayfa gizlendiğinde overlay göster
    if (document.hidden) {
        // Kısa süreliğine overlay göster
        showScreenshotOverlay();
    }
}

/**
 * Blur event handler
 * Pencere focus'unu kaybettiğinde
 */
function handleBlur() {
    // Blur olduğunda kısa süre overlay göster
    // SS araçları genellikle pencere blur'u tetikler
    setTimeout(() => {
        if (!document.hasFocus()) {
            showScreenshotOverlay();
            logScreenshotAttempt('Window Blur');
        }
    }, 50);
}

/**
 * Klavye ile screenshot algılama
 * PrintScreen ve platform spesifik kısayollar
 */
function handleScreenshotKeys(e) {
    const key = e.key;
    const code = e.code;

    // Windows PrintScreen
    if (key === 'PrintScreen' || code === 'PrintScreen') {
        e.preventDefault();
        showScreenshotOverlay();
        logScreenshotAttempt('PrintScreen tuşu');
        return false;
    }

    // Windows Snipping Tool (Win + Shift + S)
    if (e.metaKey && e.shiftKey && key.toLowerCase() === 's') {
        e.preventDefault();
        showScreenshotOverlay();
        logScreenshotAttempt('Win + Shift + S');
        return false;
    }

    // Mac screenshot (Cmd + Shift + 3 veya 4)
    if (e.metaKey && e.shiftKey && (key === '3' || key === '4' || key === '5')) {
        e.preventDefault();
        showScreenshotOverlay();
        logScreenshotAttempt(`Cmd + Shift + ${key}`);
        return false;
    }

    // Alt + PrintScreen (aktif pencere)
    if (e.altKey && (key === 'PrintScreen' || code === 'PrintScreen')) {
        e.preventDefault();
        showScreenshotOverlay();
        logScreenshotAttempt('Alt + PrintScreen');
        return false;
    }
}

/**
 * Screen Capture API algılama
 * Tarayıcı screen capture API kullandığında
 */
async function detectScreenCapture() {
    if ('getDisplayMedia' in navigator.mediaDevices) {
        // getDisplayMedia çağrıldığında algılama yapılamıyor
        // ama en azından izin isteği gösterildiğinde blur olur
        console.log('[INFO] Screen Capture API mevcut');
    }
}

/**
 * Periyodik koruma kontrolü
 * Her 500ms'de ekran durumunu kontrol et
 */
function startPeriodicCheck() {
    setInterval(() => {
        // Pencere focus'unu kontrol et
        if (!document.hasFocus() && !document.hidden) {
            // Potansiyel screenshot aracı aktif
            // Çok agresif olabilir, dikkatli kullan
        }
    }, 500);
}

/**
 * CSS Pointer Events ile koruma
 * Screenshot araçları bazen pointer events'i tetikler
 */
function applyPointerProtection() {
    document.querySelectorAll('.artwork-card__image, .lightbox__image, canvas').forEach(el => {
        el.addEventListener('pointerdown', (e) => {
            // Beklenmedik pointer event
            if (e.pointerType === 'mouse' && e.pressure === 0) {
                // Potansiyel screenshot aracı
            }
        });
    });
}

/**
 * Tüm screenshot korumalarını başlat
 */
export function initScreenshotProtection() {
    if (screenshotProtectionActive) return;
    screenshotProtectionActive = true;

    // Visibility change (sekme değişikliği)
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Window blur (pencere focus kaybı)
    window.addEventListener('blur', handleBlur);

    // Klavye screenshot kısayolları
    document.addEventListener('keydown', handleScreenshotKeys, true);
    document.addEventListener('keyup', handleScreenshotKeys, true);

    // Periyodik kontrol başlat
    startPeriodicCheck();

    // Screen Capture API kontrolü
    detectScreenCapture();

    // Pointer koruma
    // MutationObserver ile yeni eklenen görsellere de uygula
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            applyPointerProtection();
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('[GÜVENLİK] Screenshot koruma sistemi aktif');
}

/**
 * Screenshot korumalarını kaldır
 */
export function removeScreenshotProtection() {
    screenshotProtectionActive = false;

    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('blur', handleBlur);
    document.removeEventListener('keydown', handleScreenshotKeys, true);
    document.removeEventListener('keyup', handleScreenshotKeys, true);
}

export default {
    initScreenshotProtection,
    removeScreenshotProtection,
    showScreenshotOverlay
};
