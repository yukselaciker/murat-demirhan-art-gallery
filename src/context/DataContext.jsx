// ============================================
// DATA CONTEXT - MURAT DEMİRHAN PORTFOLYO
// Uses prefetched data from index.html inline script
// Data fetching starts BEFORE React bundle even downloads!
// ============================================

// Data fetching starts BEFORE React bundle even downloads!
// ============================================

import { resolveImageUrl } from '../lib/resolveImageUrl';
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
 * Handles: Supabase Storage, Cloudinary, Cloudflare R2, and generic URLs
 */
function getThumbnailUrl(imageUrl, width = 600, quality = 75) {
    return resolveImageUrl(imageUrl);
}

/**
 * Normalize raw API data to frontend format
 * Handles EAV (key-value) structure from site_settings table
 */
function normalizeData(rawData) {
    const { artworks: rawArtworks, exhibitions: rawExhibitions, settings } = rawData;

    // Debug: Log what we received
    console.log('[normalizeData] Settings received:', settings);
    console.log('[normalizeData] Settings keys:', settings ? Object.keys(settings) : 'null');

    // Normalize artworks with thumbnails
    const artworks = Array.isArray(rawArtworks)
        ? rawArtworks.map(a => {
            const fullImage = a.image_url || a.image || a.imageUrl;
            return {
                ...a,
                image: resolveImageUrl(fullImage),
                thumbnail: resolveImageUrl(fullImage),
            };
        })
        : [];

    const exhibitions = Array.isArray(rawExhibitions) ? rawExhibitions : [];

    // Settings is now an object with keys like: cv, contact, featuredArtworkId
    // from the parseSettings transformation in index.html
    // from the parseSettings transformation in index.html
    const cv = settings?.cv ? {
        ...DEFAULT_DATA.cv,
        ...settings.cv,
        artistPhoto: settings.cv.artistPhoto ? resolveImageUrl(settings.cv.artistPhoto) : ''
    } : DEFAULT_DATA.cv;

    const contactInfo = settings?.contactInfo || settings?.contact || DEFAULT_DATA.contactInfo;
    const featuredArtworkId = settings?.featuredArtworkId ? Number(settings.featuredArtworkId) : null;

    console.log('[normalizeData] CV:', cv);
    console.log('[normalizeData] ContactInfo:', contactInfo);
    console.log('[normalizeData] FeaturedID:', featuredArtworkId);

    return {
        artworks,
        exhibitions,
        cv,
        contactInfo,
        featuredArtworkId,
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
                    // Fallback: fetch directly from Cloudflare Worker
                    console.log('[DataContext] Prefetch not found, fetching from Worker...');

                    const API_BASE = 'https://murat-demirhan-worker.yukselaciker.workers.dev';

                    const [rawArtworks, settings] = await Promise.all([
                        fetch(`${API_BASE}/api/artworks`).then(r => r.ok ? r.json() : []).catch(() => []),
                        fetch(`${API_BASE}/api/settings`).then(r => r.ok ? r.json() : {}).catch(() => ({}))
                    ]);
                    // Exhibitions are not yet in D1, so empty array
                    const rawExhibitions = [];

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
