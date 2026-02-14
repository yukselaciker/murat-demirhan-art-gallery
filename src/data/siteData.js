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
// ============================================
// 2. DATA SERVICE LAYER (Abstraction)
// ============================================

// Import token helper from feedApi to share authentication
import { getAdminToken } from '../lib/feedApi';

const API_BASE = 'https://murat-demirhan-worker.yukselaciker.workers.dev';
const USE_API = true; // Always use D1 Worker API now

// Helper for authenticated headers
function getAuthHeaders() {
  const token = getAdminToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

// API Implementation (Cloudflare Worker D1)
// Module-level cache to prevent duplicate requests
let apiDataCache = null;
let apiFetchPromise = null;
let cacheTimestamp = null;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

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

    // If fetch in progress, wait for existing promise
    if (apiFetchPromise) {
      return apiFetchPromise;
    }

    // Start new fetch
    apiFetchPromise = (async () => {
      console.log('[ApiDataService] Fetching all data from Worker API...');

      // Fetch Artworks from Worker
      let artworks = [];
      try {
        const res = await fetch(`${API_BASE}/api/artworks`);
        if (res.ok) {
          const rawArtworks = await res.json();
          // Normalize artworks
          artworks = Array.isArray(rawArtworks)
            ? rawArtworks.map(a => {
              const fullImage = a.image_url || a.image || a.imageUrl;
              return {
                ...a,
                image: resolveImageUrl(fullImage),
                thumbnail: resolveImageUrl(fullImage),
              };
            })
            : [];
        }
      } catch (e) {
        console.error('[ApiDataService] Failed to fetch artworks:', e);
      }

      // Exhibitions (Not yet in D1)
      const exhibitions = [];

      // Settings (CV, Contact, Featured)
      let cv = DEFAULT_DATA.cv;
      let contactInfo = DEFAULT_DATA.contactInfo;
      let featuredArtworkId = null;

      try {
        const settingsRes = await fetch(`${API_BASE}/api/settings`);
        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          if (settings.cv) cv = { ...DEFAULT_DATA.cv, ...settings.cv };
          if (settings.contactInfo) contactInfo = { ...DEFAULT_DATA.contactInfo, ...settings.contactInfo };
          if (settings.featuredArtworkId) featuredArtworkId = Number(settings.featuredArtworkId);
        }
      } catch (e) {
        console.error('[ApiDataService] Failed to fetch settings:', e);
      }

      const result = {
        artworks,
        exhibitions,
        cv,
        contactInfo,
        featuredArtworkId,
      };

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
    const res = await fetch(`${API_BASE}/api/artworks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(artwork)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to add artwork');
    }
    return await res.json();
  },

  updateArtwork: async (id, artwork) => {
    const res = await fetch(`${API_BASE}/api/artworks?id=${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(artwork)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update artwork');
    }
    return await res.json();
  },

  deleteArtwork: async (id) => {
    const res = await fetch(`${API_BASE}/api/artworks?id=${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete artwork');
    }
    return await res.json();
  },

  // ===== EXHIBITIONS & SETTINGS (Placeholder for now) =====
  addExhibition: async () => { throw new Error('Exhibitions not yet migrated to D1'); },
  updateExhibition: async () => { throw new Error('Exhibitions not yet migrated to D1'); },
  deleteExhibition: async () => { throw new Error('Exhibitions not yet migrated to D1'); },
  updateCv: async (cvData) => {
    const res = await fetch(`${API_BASE}/api/settings?key=cv`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(cvData)
    });
    if (!res.ok) throw new Error('Failed to update CV');
    return await res.json();
  },
  updateContactInfo: async (info) => {
    const res = await fetch(`${API_BASE}/api/settings?key=contactInfo`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(info)
    });
    if (!res.ok) throw new Error('Failed to update contact info');
    return await res.json();
  },

  setFeaturedArtwork: async (id) => {
    const res = await fetch(`${API_BASE}/api/settings?key=featuredArtworkId`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(id)
    });
    if (!res.ok) throw new Error('Failed to update featured artwork');
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

            // Force refresh
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
        // API modunda Supabase'e kaydet (Şimdi Worker'a)
        if (USE_API) {
          try {
            await ApiDataService.setFeaturedArtwork(artworkId);
            ApiDataService.invalidateCache();
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
