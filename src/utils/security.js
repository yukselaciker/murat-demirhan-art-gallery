// ============================================
// SECURITY UTILITY - MURAT DEMİRHAN PORTFOLYO
// Sağ tık, kopyalama ve klavye kısayolları engelleme
// ============================================

// Engellenen tuş kombinasyonları
const BLOCKED_KEY_COMBOS = [
    { ctrl: true, key: 'c' },   // Kopyala
    { ctrl: true, key: 's' },   // Kaydet
    { ctrl: true, key: 'p' },   // Yazdır
    { ctrl: true, key: 'u' },   // Kaynak görüntüle
    { ctrl: true, shift: true, key: 'i' }, // DevTools
    { ctrl: true, shift: true, key: 'j' }, // DevTools Console
    { ctrl: true, shift: true, key: 'c' }, // DevTools Elements
    { key: 'F12' },             // DevTools
    { key: 'PrintScreen' },     // Ekran görüntüsü
];

// DevTools algılama için değişkenler
let devToolsOpen = false;
let devToolsCheckInterval = null;

/**
 * Telif hakkı uyarısını göster
 */
function showCopyrightWarning() {
    const overlay = document.getElementById('copyright-overlay');
    if (overlay) {
        overlay.classList.add('show');
        setTimeout(() => {
            overlay.classList.remove('show');
        }, 3000);
    }
}

/**
 * Konsola güvenlik logu yaz
 */
function logSecurityEvent(eventType) {
    const timestamp = new Date().toISOString();
    console.log(`[GÜVENLİK] ${eventType} algılandı - ${timestamp}`);
}

/**
 * Sağ tık engelleme
 */
function preventRightClick(e) {
    // Sadece görseller ve canvas için engelle
    if (e.target.tagName === 'IMG' || e.target.tagName === 'CANVAS') {
        e.preventDefault();
        showCopyrightWarning();
        logSecurityEvent('Sağ tık girişimi');
        return false;
    }
}

/**
 * Klavye kısayolları engelleme
 */
function preventKeyboardShortcuts(e) {
    const key = e.key.toLowerCase();

    for (const combo of BLOCKED_KEY_COMBOS) {
        const ctrlMatch = combo.ctrl ? (e.ctrlKey || e.metaKey) : true;
        const shiftMatch = combo.shift ? e.shiftKey : !combo.shift;
        const keyMatch = combo.key ? (key === combo.key.toLowerCase() || e.code === combo.key) : true;

        if (ctrlMatch && shiftMatch && keyMatch && combo.key) {
            e.preventDefault();
            showCopyrightWarning();
            logSecurityEvent(`Klavye kısayolu: ${combo.key}`);
            return false;
        }
    }
}

/**
 * Görsel sürükleme engelleme
 */
function preventDragStart(e) {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'CANVAS') {
        e.preventDefault();
        logSecurityEvent('Sürükleme girişimi');
        return false;
    }
}

/**
 * Metin seçimi engelleme (görseller için)
 */
function preventSelection(e) {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'CANVAS') {
        e.preventDefault();
        return false;
    }
}

/**
 * DevTools algılama
 * Window boyutu değişikliklerini ve console.log zamanlamasını izler
 */
function checkDevTools() {
    const threshold = 160;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;

    if (widthThreshold || heightThreshold) {
        if (!devToolsOpen) {
            devToolsOpen = true;
            onDevToolsOpen();
        }
    } else {
        if (devToolsOpen) {
            devToolsOpen = false;
            onDevToolsClose();
        }
    }
}

/**
 * DevTools açıldığında çalışır
 */
function onDevToolsOpen() {
    logSecurityEvent('DevTools açıldı');

    // Tüm görselleri bulanıklaştır
    const images = document.querySelectorAll('img, canvas, .artwork-card__image-wrapper');
    images.forEach(img => {
        img.style.filter = 'blur(20px)';
        img.style.transition = 'filter 0.3s ease';
    });

    // Uyarı overlay göster
    let devToolsOverlay = document.getElementById('devtools-overlay');
    if (!devToolsOverlay) {
        devToolsOverlay = document.createElement('div');
        devToolsOverlay.id = 'devtools-overlay';
        devToolsOverlay.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(139, 69, 87, 0.95);
        color: white;
        padding: 40px 60px;
        border-radius: 12px;
        text-align: center;
        z-index: 99999;
        font-family: 'Playfair Display', serif;
      ">
        <h2 style="margin: 0 0 15px; font-size: 24px;">🔒 Güvenlik Uyarısı</h2>
        <p style="margin: 0; font-size: 16px;">Geliştirici araçları açık olduğu için<br>görseller gizlendi.</p>
      </div>
    `;
        document.body.appendChild(devToolsOverlay);
    }
    devToolsOverlay.style.display = 'block';
}

/**
 * DevTools kapandığında çalışır
 */
function onDevToolsClose() {
    logSecurityEvent('DevTools kapatıldı');

    // Bulanıklığı kaldır
    const images = document.querySelectorAll('img, canvas, .artwork-card__image-wrapper');
    images.forEach(img => {
        img.style.filter = '';
    });

    // Overlay'i gizle
    const devToolsOverlay = document.getElementById('devtools-overlay');
    if (devToolsOverlay) {
        devToolsOverlay.style.display = 'none';
    }
}

/**
 * Console.log ile DevTools algılama (ek yöntem)
 */
function setupConsoleDevToolsDetection() {
    const element = new Image();
    Object.defineProperty(element, 'id', {
        get: function () {
            devToolsOpen = true;
            onDevToolsOpen();
        }
    });

    // Periyodik kontrol
    setInterval(() => {
        console.log('%c', element);
        console.clear();
    }, 1000);
}

/**
 * Tüm güvenlik korumalarını başlat
 */
export function initSecurityProtection() {
    // Sağ tık engelleme
    document.addEventListener('contextmenu', preventRightClick);

    // Klavye kısayolları engelleme
    document.addEventListener('keydown', preventKeyboardShortcuts);

    // Sürükleme engelleme
    document.addEventListener('dragstart', preventDragStart);

    // Seçim engelleme
    document.addEventListener('selectstart', preventSelection);

    // DevTools algılama
    devToolsCheckInterval = setInterval(checkDevTools, 500);
    window.addEventListener('resize', checkDevTools);

    // Console tabanlı DevTools algılama
    // setupConsoleDevToolsDetection(); // Opsiyonel - performansı etkileyebilir

    console.log('%c⚠️ GÜVENLİK UYARISI', 'color: #8B4557; font-size: 24px; font-weight: bold;');
    console.log('%cBu sitedeki tüm eserler telif hakkı ile korunmaktadır.', 'color: #666; font-size: 14px;');
    console.log('%c5846 sayılı Fikir ve Sanat Eserleri Kanunu kapsamında izinsiz kullanım suçtur.', 'color: #666; font-size: 12px;');
}

/**
 * Güvenlik korumalarını kaldır
 */
export function removeSecurityProtection() {
    document.removeEventListener('contextmenu', preventRightClick);
    document.removeEventListener('keydown', preventKeyboardShortcuts);
    document.removeEventListener('dragstart', preventDragStart);
    document.removeEventListener('selectstart', preventSelection);

    if (devToolsCheckInterval) {
        clearInterval(devToolsCheckInterval);
    }
    window.removeEventListener('resize', checkDevTools);
}

export default {
    initSecurityProtection,
    removeSecurityProtection,
    showCopyrightWarning
};
