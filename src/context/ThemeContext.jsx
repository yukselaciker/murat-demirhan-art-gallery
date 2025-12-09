// ============================================
// THEME CONTEXT - MURAT DEMİRHAN PORTFOLYO
// Light/Dark mode yönetimi
// ============================================

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        // localStorage'dan tema tercihini oku
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme');
            if (saved) return saved;

            // Sistem tercihini kontrol et
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
        }
        return 'light';
    });

    useEffect(() => {
        // HTML'e data-theme attribute ekle
        document.documentElement.setAttribute('data-theme', theme);
        // localStorage'a kaydet
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const value = {
        theme,
        setTheme,
        toggleTheme,
        isDark: theme === 'dark'
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

export default ThemeContext;
