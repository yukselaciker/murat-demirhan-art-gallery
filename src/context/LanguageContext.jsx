// ============================================
// LANGUAGE CONTEXT - MURAT DEMİRHAN PORTFOLYO
// Çok dilli yapı yönetimi (TR/EN)
// ============================================
/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import translations from '../data/translations';

const LanguageContext = createContext(undefined);

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(() => {
        // localStorage'dan dil tercihini oku
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('language');
            if (saved && (saved === 'tr' || saved === 'en')) {
                return saved;
            }
        }
        return 'tr'; // Varsayılan dil Türkçe
    });

    useEffect(() => {
        // HTML lang attribute güncelle
        document.documentElement.setAttribute('lang', language);
        // localStorage'a kaydet
        localStorage.setItem('language', language);
    }, [language]);

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'tr' ? 'en' : 'tr');
    };

    // Çeviri getirme fonksiyonu
    // Kullanım: t('nav.home') veya t('hero.title')
    const t = useCallback((key) => {
        const keys = key.split('.');
        let value = translations[language];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                // Çeviri bulunamazsa key'i döndür
                console.warn(`Translation not found: ${key}`);
                return key;
            }
        }

        return value;
    }, [language]);

    const value = {
        language,
        setLanguage,
        toggleLanguage,
        t,
        isEnglish: language === 'en',
        isTurkish: language === 'tr'
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

export default LanguageContext;
