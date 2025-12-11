// ============================================
// ORTAK VERİ KATMANI - MURAT DEMİRHAN PORTFOLYO
// ============================================
//
// [TEKNİK ANALİZ NOTU]
// MEVCUT DURUM: 
// Bu projede bir Backend API (Node.js/Python vb.) ve Veritabanı (PostgreSQL/MongoDB) BULUNMAMAKTADIR.
// Tüm veriler tarayıcının "localStorage" alanında saklanmaktadır.
//
// NEDEN VERİLER "KAYBOLUYOR"?
// 1. Farklı Tarayıcı/Cihaz: localStorage cihaz/tarayıcı bazlıdır. Chrome'da yapılan değişiklik Firefox'a geçmez.
// 2. Gizli Sekme: Gizli sekme kapatılınca veriler silinir.
// 3. Veri Bozulması: Hatalı bir kayıt olursa, yükleme sırasında "varsayılan" veriye dönülüyor olabilir.
//
// ÇÖZÜM:
// Aşağıda, veri kaybını en aza indiren, hatalara karşı dayanıklı (resilient) bir "DataService" yapısı kurulmuştur.
// Ancak "Gerçek Cross-Device Persistence" için mutlaka bir Backend gereklidir.
// ============================================

import { useEffect, useMemo, useState } from 'react';

// ============================================
// IMAGE OPTIMIZATION HELPER
// ============================================
/**
 * Generates an optimized thumbnail URL for faster initial load.
 * Appends width and quality parameters to reduce payload size.
 * Works with Supabase Storage, Cloudinary, or any CDN that supports URL transformations.
 * @param {string} imageUrl - Original image URL
 * @param {number} width - Target width in pixels (default: 600)
 * @param {number} quality - JPEG quality 1-100 (default: 75)
 * @returns {string} Optimized thumbnail URL
 */
// ============================================
// IMAGE OPTIMIZATION HELPER
// ============================================
import { resolveImageUrl } from '../lib/resolveImageUrl';

/**
 * Generates public URL for images.
 * Uses the Worker proxy for R2 consistency.
 */
function getThumbnailUrl(imageUrl, width = 600, quality = 75) {
  return resolveImageUrl(imageUrl);
}

// ============================================
// 1. DATA SCHEMA & DEFAULTS
// ============================================
const DEFAULT_DATA = {
  // Tüm veriler Supabase API'den geliyor - hardcoded data YOK!
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

const STORAGE_KEY = 'md-site-data';

// ============================================
// 2. DATA SERVICE LAYER (Abstraction)
// ============================================
// API varsayılan olarak AÇIK - Vercel'de Supabase kullanılıyor
const USE_API = import.meta.env.VITE_USE_API !== 'false';

// ============================================
// 2. DATA SERVICE LAYER (Abstraction)
// ============================================

// LocalStorage Implementation (Mevcut)
const LocalDataService = {
  load: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        console.log('[LocalDataService] No data found, using defaults.');
        return DEFAULT_DATA;
      }

      const parsed = JSON.parse(raw);

      // Validation / Merging Strategy
      if (!parsed || typeof parsed !== 'object') {
        return DEFAULT_DATA;
      }

      // Bozuk veri gelirse, uygulamanın çökmemesi için default veri ile birleştiriyoruz.
      return {
        artworks: Array.isArray(parsed.artworks) ? parsed.artworks : DEFAULT_DATA.artworks,
        exhibitions: Array.isArray(parsed.exhibitions) ? parsed.exhibitions : DEFAULT_DATA.exhibitions,
        cv: parsed.cv ? { ...DEFAULT_DATA.cv, ...parsed.cv } : DEFAULT_DATA.cv,
        contactInfo: parsed.contactInfo ? { ...DEFAULT_DATA.contactInfo, ...parsed.contactInfo } : DEFAULT_DATA.contactInfo,
        featuredArtworkId: parsed.featuredArtworkId !== undefined ? parsed.featuredArtworkId : DEFAULT_DATA.featuredArtworkId,
      };
    } catch (e) {
      console.error('[LocalDataService] Error loading data, falling back to defaults:', e);
      return DEFAULT_DATA;
    }
  },

  save: (data) => {
    try {
      if (!data || typeof data !== 'object') throw new Error('Invalid data format');
      const serialized = JSON.stringify(data);
      localStorage.setItem(STORAGE_KEY, serialized);
      window.dispatchEvent(new Event('local-data-update'));
      return true;
    } catch (e) {
      console.error('[LocalDataService] Failed to save data:', e);
      return false;
    }
  },

  reset: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (e) {
      console.error('[LocalDataService] Reset failed:', e);
      return false;
    }
  }
};

// API Implementation (Vercel Serverless + Supabase)
// Module-level cache to prevent duplicate requests
let apiDataCache = null;
let apiFetchPromise = null;
let cacheTimestamp = null;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 dakika cache TTL (mobil için optimize)

const ApiDataService = {
  // Invalidate cache - call after mutations
  invalidateCache: () => {
    apiDataCache = null;
    apiFetchPromise = null;
    cacheTimestamp = null;
    console.log('[ApiDataService] Cache invalidated');
  },

  load: async () => {
    // Check if cache is still valid (within TTL)
    const now = Date.now();
    const cacheExpired = cacheTimestamp && (now - cacheTimestamp > CACHE_TTL_MS);

    if (cacheExpired) {
      console.log('[ApiDataService] Cache expired, fetching fresh data...');
      apiDataCache = null;
      apiFetchPromise = null;
    }

    // Return cached data if available and not expired
    if (apiDataCache) {
      console.log('[ApiDataService] Returning cached data');
      return apiDataCache;
    }

    // If fetch in progress, wait for existing promise (prevents duplicate requests)
    if (apiFetchPromise) {
      console.log('[ApiDataService] Fetch in progress, waiting for existing promise...');
      return apiFetchPromise;
    }

    // Start new fetch and store promise
    apiFetchPromise = (async () => {
      console.log('[ApiDataService] Fetching all data from API...');

      // FAIL-SAFE: Fetch each independently so one failure doesn't block others
      let rawArtworks = [];
      let rawExhibitions = [];
      let settings = {};

      // Fetch artworks
      try {
        const res = await fetch('/api/artworks');
        if (res.ok) {
          rawArtworks = await res.json();
          console.log('[ApiDataService] Artworks loaded:', rawArtworks.length);
        } else {
          console.error('[ApiDataService] Artworks fetch failed:', res.status);
        }
      } catch (e) {
        console.error('[ApiDataService] Artworks error:', e);
      }

      // Fetch exhibitions
      try {
        const res = await fetch('/api/exhibitions');
        if (res.ok) {
          rawExhibitions = await res.json();
          console.log('[ApiDataService] Exhibitions loaded:', rawExhibitions.length);
        } else {
          console.error('[ApiDataService] Exhibitions fetch failed:', res.status);
        }
      } catch (e) {
        console.error('[ApiDataService] Exhibitions error:', e);
      }

      // Fetch settings (most likely to fail - isolated so it doesn't break others)
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          settings = await res.json();
          console.log('[ApiDataService] Settings loaded:', Object.keys(settings));
        } else {
          console.error('[ApiDataService] Settings fetch failed:', res.status);
        }
      } catch (e) {
        console.error('[ApiDataService] Settings error:', e);
      }

      // NORMALIZE: Supabase column names to frontend names
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
      const cv = settings.cv ? {
        ...settings.cv,
        artistPhoto: resolveImageUrl(settings.cv.artistPhoto)
      } : DEFAULT_DATA.cv;
      const contactInfo = settings.contact || DEFAULT_DATA.contactInfo;

      console.log('[ApiDataService] Final:', artworks.length, 'artworks,', exhibitions.length, 'exhibitions');

      const result = {
        artworks,
        exhibitions,
        cv,
        contactInfo,
        featuredArtworkId: settings.featuredArtworkId || null,
      };

      // Store in cache with timestamp
      apiDataCache = result;
      cacheTimestamp = Date.now();
      apiFetchPromise = null;

      return result;
    })();

    return apiFetchPromise;
  },

  save: async () => {
    console.warn('[ApiDataService] Use specific CRUD methods instead of save()');
    return true;
  },

  reset: async () => false,

  // ===== ARTWORKS CRUD =====
  addArtwork: async (artwork) => {
    const res = await fetch('/api/artworks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(artwork)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to add artwork');
    }
    return await res.json();
  },

  updateArtwork: async (id, artwork) => {
    const res = await fetch(`/api/artworks?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(artwork)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update artwork');
    }
    return await res.json();
  },

  deleteArtwork: async (id) => {
    const res = await fetch(`/api/artworks?id=${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete artwork');
    }
    return await res.json();
  },

  // ===== EXHIBITIONS CRUD =====
  addExhibition: async (exhibition) => {
    const res = await fetch('/api/exhibitions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(exhibition)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to add exhibition');
    }
    return await res.json();
  },

  updateExhibition: async (id, exhibition) => {
    const res = await fetch(`/api/exhibitions?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(exhibition)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update exhibition');
    }
    return await res.json();
  },

  deleteExhibition: async (id) => {
    const res = await fetch(`/api/exhibitions?id=${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete exhibition');
    }
    return await res.json();
  },

  // ===== SETTINGS (CV, Contact) =====
  updateCv: async (cv) => {
    const res = await fetch('/api/settings?key=cv', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cv)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update CV');
    }
    return await res.json();
  },

  updateContactInfo: async (contact) => {
    const res = await fetch('/api/settings?key=contact', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update contact info');
    }
    return await res.json();
  }
};

// Aktif Servis Seçimi
// LocalDataService tamamen senkron, ApiDataService ise asenkron çalışır.
// useSiteData içinde DataService.load() senkron çağrıldığı için, API modunda
// başlangıçta LocalStorage'dan veri okunur, useEffect içinde API'den tazelenir.
// Tam asenkron akış için hook'lar yeniden düzenlenmelidir.

const DataService = {
  load: () => {
    // API modunda bile başlangıçta LocalStorage'dan hızlıca veri okuyup, useEffect içinde API'den güncelliyoruz.
    if (USE_API) {
      return LocalDataService.load();
    }
    return LocalDataService.load();
  },
  save: (data) => {
    if (USE_API) return ApiDataService.save(data);
    return LocalDataService.save(data);
  },
  reset: () => LocalDataService.reset()
};

// ============================================
// 3. HOOKS
// ============================================

// Admin Hook - Veriyi okur ve yazar
// Admin Hook - Veriyi okur ve yazar
export function useSiteData() {
  // Başlangıçta güvenli/boş veri veya LocalStorage (senkron ise)
  const [data, setData] = useState(() => {
    if (USE_API) return DEFAULT_DATA; // API async olduğu için bekleyeceğiz
    return LocalDataService.load();
  });

  const [isInitialized, setIsInitialized] = useState(false);

  // Veri Yükleme (Async & Sync Desteği)
  useEffect(() => {
    const loadData = async () => {
      try {
        let validData;
        if (USE_API) {
          validData = await ApiDataService.load();
        } else {
          validData = LocalDataService.load();
        }
        setData(validData);
        setIsInitialized(true);
      } catch (err) {
        console.error("Data load failed:", err);
        // API hata alsa bile isInitialized true yapılmalı, yoksa sonsuz yükleme ekranı olur!
        setIsInitialized(true);
      }
    };
    loadData();
  }, []);

  // Save on change (Sadece LocalStorage modunda otomatik kaydet)
  useEffect(() => {
    if (!USE_API && isInitialized) {
      LocalDataService.save(data);
    }
  }, [data, isInitialized]);

  // Helpers (CRUD Operations)
  const nextId = (arr) => (arr.length ? Math.max(...arr.map((i) => Number(i.id))) + 1 : 1);

  const helpers = useMemo(
    () => ({
      addArtwork: async (payload) => {
        if (USE_API) {
          try {
            await ApiDataService.addArtwork(payload);
            // Ekleme sonrası cache temizle ve veriyi tazele
            ApiDataService.invalidateCache();
            const freshData = await ApiDataService.load();
            setData(freshData);
            return true;
          } catch (e) {
            console.error('Add failed', e);
            alert('Eser eklenirken hata oluştu');
            return false;
          }
        } else {
          setData((prev) => ({
            ...prev,
            artworks: [...prev.artworks, { ...payload, id: nextId(prev.artworks) }],
          }));
        }
      },
      updateArtwork: async (id, payload) => {
        if (USE_API) {
          try {
            // PUT /api/artworks?id=...
            const res = await fetch(`/api/artworks?id=${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('Update failed');

            // Refresh data from server
            ApiDataService.invalidateCache();
            const freshData = await ApiDataService.load();
            setData(freshData);
            return true;
          } catch (e) {
            console.error('Update artwork failed', e);
            alert('Eser güncellenirken hata oluştu');
            return false;
          }
        } else {
          setData((prev) => ({
            ...prev,
            artworks: prev.artworks.map((a) => (a.id === id ? { ...a, ...payload } : a)),
          }));
        }
      },

      deleteArtwork: async (id) => {
        if (USE_API) {
          try {
            // DELETE /api/artworks?id=...
            const res = await fetch(`/api/artworks?id=${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Delete failed');

            // Silme sonrası cache temizle ve veriyi tazele
            ApiDataService.invalidateCache();
            const freshData = await ApiDataService.load();
            setData(freshData);
          } catch (e) {
            console.error('Delete artwork failed', e);
            alert('Silme işlemi başarısız');
          }
        } else {
          setData((prev) => ({
            ...prev,
            artworks: prev.artworks.filter((a) => a.id !== id),
          }));
        }
      },
      addExhibition: async (payload) => {
        if (USE_API) {
          try {
            await ApiDataService.addExhibition(payload);
            ApiDataService.invalidateCache();
            const freshData = await ApiDataService.load();
            setData(freshData);
            return true;
          } catch (e) {
            console.error('Add exhibition failed', e);
            alert('Sergi eklenirken hata oluştu: ' + e.message);
            return false;
          }
        } else {
          setData((prev) => ({
            ...prev,
            exhibitions: [...prev.exhibitions, { ...payload, id: nextId(prev.exhibitions) }],
          }));
        }
      },
      updateExhibition: async (id, payload) => {
        if (USE_API) {
          try {
            await ApiDataService.updateExhibition(id, payload);
            ApiDataService.invalidateCache();
            const freshData = await ApiDataService.load();
            setData(freshData);
            return true;
          } catch (e) {
            console.error('Update exhibition failed', e);
            alert('Sergi güncellenirken hata oluştu: ' + e.message);
            return false;
          }
        } else {
          setData((prev) => ({
            ...prev,
            exhibitions: prev.exhibitions.map((e) => (e.id === id ? { ...e, ...payload } : e)),
          }));
        }
      },
      deleteExhibition: async (id) => {
        if (USE_API) {
          try {
            await ApiDataService.deleteExhibition(id);
            ApiDataService.invalidateCache();
            const freshData = await ApiDataService.load();
            setData(freshData);
          } catch (e) {
            console.error('Delete exhibition failed', e);
            alert('Sergi silinirken hata oluştu: ' + e.message);
          }
        } else {
          setData((prev) => ({
            ...prev,
            exhibitions: prev.exhibitions.filter((e) => e.id !== id),
          }));
        }
      },
      updateCv: async (payload) => {
        if (USE_API) {
          try {
            // Merge with current CV data
            const newCv = { ...data.cv, ...payload };
            await ApiDataService.updateCv(newCv);
            ApiDataService.invalidateCache();
            const freshData = await ApiDataService.load();
            setData(freshData);
            return true;
          } catch (e) {
            console.error('Update CV failed', e);
            alert('CV güncellenirken hata oluştu: ' + e.message);
            return false;
          }
        } else {
          setData((prev) => ({
            ...prev,
            cv: { ...prev.cv, ...payload },
          }));
        }
      },
      updateContactInfo: async (payload) => {
        if (USE_API) {
          try {
            const newContact = { ...data.contactInfo, ...payload };
            await ApiDataService.updateContactInfo(newContact);
            ApiDataService.invalidateCache();
            const freshData = await ApiDataService.load();
            setData(freshData);
            return true;
          } catch (e) {
            console.error('Update contact failed', e);
            alert('İletişim bilgileri güncellenirken hata oluştu: ' + e.message);
            return false;
          }
        } else {
          setData((prev) => ({
            ...prev,
            contactInfo: { ...prev.contactInfo, ...payload },
          }));
        }
      },
      setFeaturedArtwork: async (artworkId) => {
        setData((prev) => ({
          ...prev,
          featuredArtworkId: artworkId,
        }));
        // API modunda Supabase'e kaydet
        if (USE_API) {
          try {
            await fetch('/api/settings?key=featuredArtworkId', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(artworkId)
            });
          } catch (e) {
            console.error('Failed to save featured artwork:', e);
          }
        }
      },
      resetData: () => {
        if (confirm('Tüm verileri silip varsayılanlara dönmek istediğinize emin misiniz?')) {
          DataService.reset();
          setData(DEFAULT_DATA);
        }
      }
    }),
    [data]
  );

  return { data, setData, ...helpers, isInitialized };
}

// Public Hook - Sadece okur (API'den async olarak)
export function usePublicData() {
  // Check if we have cached data immediately
  const cachedData = apiDataCache;

  // USE_API true ise: cache varsa kullan, yoksa DEFAULT_DATA
  const [data, setData] = useState(() => {
    if (USE_API) {
      // Cache'de veri varsa hemen kullan (loading yok!)
      return cachedData || DEFAULT_DATA;
    }
    return DataService.load();
  });

  // Cache varsa loading yok, yoksa loading var
  const [isLoading, setIsLoading] = useState(USE_API && !cachedData);

  // API'den veri yükle (cache yoksa veya expire olduysa)
  useEffect(() => {
    const loadData = async () => {
      try {
        let validData;
        if (USE_API) {
          validData = await ApiDataService.load();
        } else {
          validData = DataService.load();
        }
        setData(validData);
      } catch (err) {
        console.error("[usePublicData] Data load failed:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return { ...data, isLoading };
}

// Deprecated export but kept for compatibility
export function loadSiteData() {
  return DataService.load();
}

export function saveSiteData(data) {
  return DataService.save(data);
}

export default {
  useSiteData,
  usePublicData,
  loadSiteData,
  saveSiteData,
};
