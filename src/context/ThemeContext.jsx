// ============================================
// THEME CONTEXT - MURAT DEMİRHAN PORTFOLYO
// Light/Dark mode yönetimi
// ============================================
/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
    // Koyu modu kaldırdık, her zaman 'light' teması.
    const theme = 'light';

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }, []);

    const toggleTheme = () => {
        // No-op (veya console log)
        console.log('Dark mode is disabled by design.');
    };

    const value = {
        theme,
        setTheme: () => { },
        toggleTheme,
        isDark: false
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
