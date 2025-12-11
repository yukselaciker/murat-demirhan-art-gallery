import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    // 1. Theme State
    const [themeMode, setThemeMode] = useLocalStorage('admin_theme', 'light');

    // 2. Auth State (Mock for now, or real if Supabase integrated later)
    const [isAuthenticated, setIsAuthenticated] = useLocalStorage('admin_auth', false);
    const [user, setUser] = useState(null);

    // 3. Tab State
    const [activeTab, setActiveTab] = useLocalStorage('admin_active_tab', 'artworks');

    // Apply theme to HTML tag
    useEffect(() => {
        const root = window.document.documentElement;
        if (themeMode === 'dark') {
            root.setAttribute('data-theme', 'dark');
            root.style.colorScheme = 'dark';
        } else {
            root.setAttribute('data-theme', 'light');
            root.style.colorScheme = 'light';
        }
    }, [themeMode]);

    const login = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        setActiveTab('artworks'); // Reset tab on logout
    };

    const toggleTheme = () => {
        setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
    };

    const value = {
        themeMode,
        toggleTheme,
        isAuthenticated,
        login,
        logout,
        activeTab,
        setActiveTab,
        user
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};
