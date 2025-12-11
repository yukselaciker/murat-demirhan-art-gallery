// ============================================
// DATA CONTEXT - MURAT DEMİRHAN PORTFOLYO
// Centralized data fetching to eliminate waterfall pattern
// This provider fetches ALL data ONCE at app startup
// ============================================

import { createContext, useContext, useState, useEffect } from 'react';

// API Configuration
const USE_API = import.meta.env.VITE_USE_API !== 'false';

// Default data structure
const DEFAULT_DATA = {
    artworks: [],
    exhibitions: [],
    cv: {
        bio: '',
        artistPhoto: '',
        education: [],
        awards: [],
        highlights: [],
    },
    contactInfo: {
        email: '',
        location: '',
        phone: '',
    },
    featuredArtworkId: null,
};

/**
 * Generates an optimized thumbnail URL for faster initial load.
 */
function getThumbnailUrl(imageUrl, width = 600, quality = 75) {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('data:')) return imageUrl;
    if (imageUrl.includes('width=') || imageUrl.includes('quality=')) return imageUrl;

    if (imageUrl.includes('supabase.co/storage')) {
        const separator = imageUrl.includes('?') ? '&' : '?';
        return `${imageUrl}${separator}width=${width}&quality=${quality}`;
    }

    if (imageUrl.includes('cloudinary.com')) {
        return imageUrl.replace('/upload/', `/upload/w_${width},q_${quality}/`);
    }

    const separator = imageUrl.includes('?') ? '&' : '?';
    return `${imageUrl}${separator}width=${width}&quality=${quality}`;
}

// Create context
const DataContext = createContext(null);

// Provider component
export function DataProvider({ children }) {
    const [data, setData] = useState(DEFAULT_DATA);
    const [isLoading, setIsLoading] = useState(true);

    // Single useEffect that fetches ALL data in PARALLEL on mount
    useEffect(() => {
        const fetchAllData = async () => {
            if (!USE_API) {
                // Local mode - use localStorage
                try {
                    const raw = localStorage.getItem('md-site-data');
                    if (raw) {
                        const parsed = JSON.parse(raw);
                        setData(parsed);
                    }
                } catch (e) {
                    console.error('[DataProvider] LocalStorage error:', e);
                }
                setIsLoading(false);
                return;
            }

            // API mode - fetch everything in PARALLEL
            try {
                console.log('[DataProvider] Fetching all data in PARALLEL...');

                // ============================================
                // CRITICAL: Promise.all for parallel fetching
                // This is the key to eliminating the waterfall
                // ============================================
                const [resArt, resExh, resSettings] = await Promise.all([
                    fetch('/api/artworks'),
                    fetch('/api/exhibitions'),
                    fetch('/api/settings')
                ]);

                // Parse all responses in parallel
                const [rawArtworks, rawExhibitions, settings] = await Promise.all([
                    resArt.ok ? resArt.json() : [],
                    resExh.ok ? resExh.json() : [],
                    resSettings.ok ? resSettings.json() : {}
                ]);

                console.log('[DataProvider] All fetches completed simultaneously');

                // Normalize artworks with thumbnails
                const artworks = Array.isArray(rawArtworks)
                    ? rawArtworks.map(a => {
                        const fullImage = a.image_url || a.image || a.imageUrl;
                        return {
                            ...a,
                            image: fullImage,
                            thumbnail: getThumbnailUrl(fullImage, 600, 75),
                        };
                    })
                    : [];

                const exhibitions = Array.isArray(rawExhibitions) ? rawExhibitions : [];
                const cv = settings.cv || DEFAULT_DATA.cv;
                const contactInfo = settings.contact || DEFAULT_DATA.contactInfo;

                console.log('[DataProvider] Loaded:', artworks.length, 'artworks,', exhibitions.length, 'exhibitions');

                setData({
                    artworks,
                    exhibitions,
                    cv,
                    contactInfo,
                    featuredArtworkId: settings.featuredArtworkId || null,
                });
            } catch (e) {
                console.error('[DataProvider] Fetch error:', e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, []); // Empty dependency - runs ONCE on mount

    const value = {
        ...data,
        isLoading,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
}

// Hook for consuming data
export function useData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}

export default DataContext;
