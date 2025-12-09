// ============================================
// POLİTİKA SAYFALARI SCRIPT
// Çerez onay bildirimi ve tema yönetimi
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    // ===== ÇEREZ BİLDİRİMİ YÖNETİMİ =====
    initCookieBanner();

    // ===== TEMA YÖNETİMİ =====
    initTheme();
});

/**
 * Çerez onay bildirimini başlat
 * localStorage'da izin kaydedilmişse gösterme
 */
function initCookieBanner() {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (!cookieBanner) return;

    // Daha önce onay verilmiş mi kontrol et
    const cookieConsent = localStorage.getItem('cookieConsent');

    if (!cookieConsent) {
        // Sayfa yüklendikten 1 saniye sonra göster
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000);
    }

    // Kabul Et butonu
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function () {
            localStorage.setItem('cookieConsent', 'accepted');
            localStorage.setItem('cookieConsentDate', new Date().toISOString());
            hideCookieBanner();

            // Analitik çerezlerini etkinleştir (opsiyonel)
            // enableAnalytics();

            console.log('[Çerez] Kullanıcı çerez kullanımını kabul etti.');
        });
    }

    // Reddet butonu
    if (declineBtn) {
        declineBtn.addEventListener('click', function () {
            localStorage.setItem('cookieConsent', 'declined');
            localStorage.setItem('cookieConsentDate', new Date().toISOString());
            hideCookieBanner();

            // Tüm çerezleri temizle (zorunlu olanlar hariç)
            // clearNonEssentialCookies();

            console.log('[Çerez] Kullanıcı çerez kullanımını reddetti.');
        });
    }
}

/**
 * Çerez bildirimini gizle
 */
function hideCookieBanner() {
    const cookieBanner = document.getElementById('cookie-banner');
    if (cookieBanner) {
        cookieBanner.style.animation = 'slideDown 0.3s ease forwards';
        setTimeout(() => {
            cookieBanner.classList.remove('show');
            cookieBanner.style.display = 'none';
        }, 300);
    }
}

/**
 * Tema yönetimi
 * Ana sitedeki tema tercihini oku
 */
function initTheme() {
    // localStorage'dan tema tercihini al
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}

/**
 * Çerez onay durumunu kontrol et
 * @returns {string|null} 'accepted', 'declined' veya null
 */
function getCookieConsent() {
    return localStorage.getItem('cookieConsent');
}

/**
 * Çerez onayını sıfırla (test için)
 */
function resetCookieConsent() {
    localStorage.removeItem('cookieConsent');
    localStorage.removeItem('cookieConsentDate');
    location.reload();
}

// Slide down animasyonu için CSS ekle
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
