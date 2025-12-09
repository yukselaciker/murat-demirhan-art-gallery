// ============================================
// COOKIE BANNER - MURAT DEMİRHAN PORTFOLYO
// Çerez onay bildirimi component'i
// ============================================

import { useState, useEffect } from 'react';
import './CookieBanner.css';

export function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // localStorage'dan onay durumunu kontrol et
        const consent = localStorage.getItem('cookieConsent');

        if (!consent) {
            // 1.5 saniye sonra göster
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'accepted');
        localStorage.setItem('cookieConsentDate', new Date().toISOString());
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookieConsent', 'declined');
        localStorage.setItem('cookieConsentDate', new Date().toISOString());
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="cookie-banner">
            <div className="cookie-banner__content">
                <p className="cookie-banner__text">
                    Bu sitede kullanıcı deneyimini geliştirmek için çerezler kullanılmaktadır.
                    Detaylı bilgi için{' '}
                    <a href="/cerez-politikasi.html">Çerez Politikası</a>'nı inceleyebilirsiniz.
                </p>
                <div className="cookie-banner__buttons">
                    <button
                        className="cookie-btn cookie-btn--decline"
                        onClick={handleDecline}
                    >
                        Reddet
                    </button>
                    <button
                        className="cookie-btn cookie-btn--accept"
                        onClick={handleAccept}
                    >
                        Kabul Et
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CookieBanner;
