// ============================================
// DATA CONTEXT - MURAT DEMİRHAN PORTFOLYO
// Centralized data fetching - STARTS IMMEDIATELY
// Uses module-level fetch to eliminate any delay
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

// ============================================
// CRITICAL: START FETCHING IMMEDIATELY AT MODULE LOAD
// This runs BEFORE React even mounts - no 4-second gap!
// ============================================
let dataPromise = null;

function startFetching() {
    if (dataPromise) return dataPromise;

    if (!USE_API) {
        // Local mode - synchronous localStorage
        try {
            const raw = localStorage.getItem('md-site-data');
            if (raw) {
                return Promise.resolve(JSON.parse(raw));
            }
        } catch (e) {
            console.error('[DataContext] LocalStorage error:', e);
        }
        return Promise.resolve(DEFAULT_DATA);
    }

    // API mode - fetch everything in PARALLEL IMMEDIATELY
    console.log('[DataContext] Starting IMMEDIATE parallel fetch...');

    dataPromise = (async () => {
        try {
            // ============================================
            // CRITICAL: Promise.all fires all 3 requests AT ONCE
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

            console.log('[DataContext] All 3 fetches completed SIMULTANEOUSLY');

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

            console.log('[DataContext] Loaded:', artworks.length, 'artworks,', exhibitions.length, 'exhibitions');

            return {
                artworks,
                exhibitions,
                cv,
                contactInfo,
                featuredArtworkId: settings.featuredArtworkId || null,
            };
        } catch (e) {
            console.error('[DataContext] Fetch error:', e);
            return DEFAULT_DATA;
        }
    })();

    return dataPromise;
}

// START FETCHING IMMEDIATELY WHEN THIS MODULE LOADS
// This happens BEFORE React even starts rendering!
startFetching();

// Create context
const DataContext = createContext(null);

// Provider component - just waits for the already-started promise
export function DataProvider({ children }) {
    const [data, setData] = useState(DEFAULT_DATA);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // The fetch already started at module load - we just await it
        startFetching()
            .then(result => {
                setData(result);
                setIsLoading(false);
            })
            .catch(() => {
                setIsLoading(false);
            });
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
