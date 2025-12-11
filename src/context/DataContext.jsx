// ============================================
// DATA CONTEXT - MURAT DEMİRHAN PORTFOLYO
// Uses prefetched data from index.html inline script
// Data fetching starts BEFORE React bundle even downloads!
// ============================================

import { createContext, useContext, useState, useEffect } from 'react';

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

/**
 * Normalize raw API data to frontend format
 */
function normalizeData(rawData) {
    const { artworks: rawArtworks, exhibitions: rawExhibitions, settings } = rawData;

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
    const cv = settings?.cv || DEFAULT_DATA.cv;
    const contactInfo = settings?.contact || DEFAULT_DATA.contactInfo;

    return {
        artworks,
        exhibitions,
        cv,
        contactInfo,
        featuredArtworkId: settings?.featuredArtworkId || null,
    };
}

// Create context
const DataContext = createContext(null);

// Provider component - uses prefetched data from index.html
export function DataProvider({ children }) {
    const [data, setData] = useState(DEFAULT_DATA);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Check if data was prefetched in index.html
                if (window.__PREFETCH_DATA__) {
                    console.log('[DataContext] Using prefetched data from HTML!');
                    const rawData = await window.__PREFETCH_DATA__;
                    const normalized = normalizeData(rawData);
                    console.log('[DataContext] Loaded:', normalized.artworks.length, 'artworks');
                    setData(normalized);
                } else {
                    // Fallback: fetch directly if prefetch failed
                    console.log('[DataContext] Prefetch not found, fetching directly...');
                    const [rawArtworks, rawExhibitions, settings] = await Promise.all([
                        fetch('/api/artworks').then(r => r.ok ? r.json() : []).catch(() => []),
                        fetch('/api/exhibitions').then(r => r.ok ? r.json() : []).catch(() => []),
                        fetch('/api/settings').then(r => r.ok ? r.json() : {}).catch(() => ({}))
                    ]);
                    const normalized = normalizeData({ artworks: rawArtworks, exhibitions: rawExhibitions, settings });
                    setData(normalized);
                }
            } catch (e) {
                console.error('[DataContext] Error loading data:', e);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

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
