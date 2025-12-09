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

import { useEffect, useMemo, useState, useCallback } from 'react';

// Görsel path yardımcı (build/base uyumlu)
const imagePath = (fileName) => `${import.meta.env.BASE_URL}images/${fileName}`;

// ============================================
// 1. DATA SCHEMA & DEFAULTS
// ============================================
const DEFAULT_DATA = {
  // ARTWORKS: Artık hardcoded/seed data YOK!
  // Tüm eserler sadece Supabase API'den geliyor.
  artworks: [],
  exhibitions: [
    {
      id: 1,
      year: '2024',
      title: 'Hafızanın Renkleri',
      venue: 'Pera Müzesi',
      city: 'İstanbul',
      type: 'Kişisel Sergi',
      description: '35 eserden oluşan retrospektif',
    },
    {
      id: 2,
      year: '2023',
      title: 'Çağdaş Türk Sanatı',
      venue: 'Galerie Kunst',
      city: 'Berlin',
      type: 'Karma Sergi',
      description: 'Uluslararası karma sergi - 5 eser',
    },
    {
      id: 3,
      year: '2022',
      title: 'Şehir ve Yalnızlık',
      venue: 'CerModern',
      city: 'Ankara',
      type: 'Grup Sergisi',
      description: 'Tematik grup sergisi - 8 eser',
    },
  ],
  cv: {
    bio: 'Murat Demirhan, hafıza ve renkler arasındaki ilişkileri tuvalde yeniden kuran çağdaş bir ressamdır.',
    artistPhoto: '',
    education: [
      { school: 'MSGSÜ, Resim', year: '2002' },
      { school: 'Atölye Çalışmaları, Avrupa', year: '2004-2006' },
    ],
    awards: [{ title: 'Genç Ressamlar Ödülü', org: 'X Sanat Derneği', year: '2010' }],
    highlights: [
      "Pera Müzesi'nde kişisel sergi (2024)",
      "Berlin'de karma sergi katılımı (2023)",
    ],
  },
  contactInfo: {
    email: 'info@muratdemirhan.com',
    location: 'İstanbul, Türkiye',
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
  load: async () => {
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
      const safeData = {
        artworks: Array.isArray(parsed.artworks) ? parsed.artworks : DEFAULT_DATA.artworks,
        exhibitions: Array.isArray(parsed.exhibitions) ? parsed.exhibitions : DEFAULT_DATA.exhibitions,
        cv: parsed.cv ? { ...DEFAULT_DATA.cv, ...parsed.cv } : DEFAULT_DATA.cv,
        contactInfo: parsed.contactInfo ? { ...DEFAULT_DATA.contactInfo, ...parsed.contactInfo } : DEFAULT_DATA.contactInfo,
        featuredArtworkId: parsed.featuredArtworkId !== undefined ? parsed.featuredArtworkId : DEFAULT_DATA.featuredArtworkId,
      };

      return safeData;
    } catch (e) {
      console.error('[LocalDataService] Error loading data, falling back to defaults:', e);
      return DEFAULT_DATA;
    }
  },

  save: async (data) => {
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

  reset: async () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (e) {
      return false;
    }
  }
};

// API Implementation (Yeni - Vercel Serverless / Backend)
const ApiDataService = {
  load: async () => {
    try {
      console.log('[ApiDataService] Fetching from API...');

      // Artworks endpoint'i hazır (User sağladı)
      const resArt = await fetch('/api/artworks');

      // Diğerleri için şimdilik mock veya boş dönebiliriz.
      // const resExh = await fetch('/api/exhibitions'); 

      if (!resArt.ok) throw new Error('API Error');

      const rawArtworks = await resArt.json();

      // NORMALIZE: Supabase'den image_url geliyor, Frontend'de image bekleniyor
      const artworks = Array.isArray(rawArtworks)
        ? rawArtworks.map(a => ({
          ...a,
          image: a.image_url || a.image || a.imageUrl, // Tüm varyasyonları destekle
        }))
        : [];

      console.log('[ApiDataService] Loaded', artworks.length, 'artworks from API');

      // Merge with defaults for other missing parts since we only have artworks API yet
      return {
        ...DEFAULT_DATA,
        artworks,
        // exhibitions: ... (TODO)
      };
    } catch (e) {
      console.error('[ApiDataService] Load error:', e);
      // LocalStorage'a FALLBACK YAPMA! Bu cross-device sync'i bozar.
      // Boş veri döndür, kullanıcı API durumunu görsün.
      console.warn('[ApiDataService] API failed, returning empty data. Check your API endpoint.');
      return {
        ...DEFAULT_DATA,
        artworks: [], // API hatası, eser listesi boş
      };
    }
  },

  save: async (data) => {
    try {
      // API modunda genellikle saveSiteData tüm veriyi post etmez,
      // ama demo için basit tutuyoruz.
      // Eser ekleme vb. işlemler kendi metodlarını kullanmalı.
      console.warn('[ApiDataService] Toplu kaydetme desteklenmiyor, endpointleri kullanın.');
      return true;
    } catch (e) {
      return false;
    }
  },

  reset: async () => {
    return false; // API'de reset tehlikeli olabilir
  },

  // CRUD Override (API modunda hooks bunları kullanır)
  addArtwork: async (artwork) => {
    const res = await fetch('/api/artworks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(artwork)
    });
    if (!res.ok) throw new Error('Failed to add artwork');
    return await res.json();
  }
};

// Aktif Servis Seçimi
// load/save metodları async olduğu için hook'lar güncellenmeli, 
// ancak şimdilik senkron gibi davranan loadSiteData() wrapper'ı ile uyumlu tutuyoruz.
// DİKKAT: useSiteData içinde DataService.load() senkron çağrılıyor. 
// API asenkron olduğu için bu yapı değişmeli.
// Şimdilik USE_API false olduğu için LocalDataService (senkron çalışabilir) kullanıyoruz.
// API'ye geçişte useSiteData tamamen asenkron hale getirilmeli.

const DataService = {
  load: () => {
    if (USE_API) {
      // Senkron wrapper hacks (bunu asenkrona çevirmek büyük refactor gerektirir)
      // Bu yüzden şimdilik API modunda bile LocalStorage'dan "başlangıç" verisi okuyoruz,
      // sonra useEffect ile API'den güncelliyoruz.
      return LocalDataService.load();
    }
    return LocalDataService.load(); // LocalService aslında senkron çalışabilir (await kaldırırsak)
  },
  save: (data) => {
    if (USE_API) return ApiDataService.save(data);
    return LocalDataService.save(data);
  },
  reset: () => LocalDataService.reset()
};

// LocalDataService metodlarını senkron hale getirelim (orijinal kod senkrondu)
// Yukarıdaki async tanımlarını kaldırıp düzeltiyorum:
LocalDataService.load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DATA;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return DEFAULT_DATA;

    return {
      artworks: Array.isArray(parsed.artworks) ? parsed.artworks : DEFAULT_DATA.artworks,
      exhibitions: Array.isArray(parsed.exhibitions) ? parsed.exhibitions : DEFAULT_DATA.exhibitions,
      cv: parsed.cv ? { ...DEFAULT_DATA.cv, ...parsed.cv } : DEFAULT_DATA.cv,
      contactInfo: parsed.contactInfo ? { ...DEFAULT_DATA.contactInfo, ...parsed.contactInfo } : DEFAULT_DATA.contactInfo,
      featuredArtworkId: parsed.featuredArtworkId !== undefined ? parsed.featuredArtworkId : DEFAULT_DATA.featuredArtworkId,
    };
  } catch (e) {
    return DEFAULT_DATA;
  }
};

LocalDataService.save = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('local-data-update'));
    return true;
  } catch (e) { return false; }
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
            // DOĞRU YÖNTEM: Ekleme sonrası veriyi sunucudan tazeleyin
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
      updateArtwork: (id, payload) =>
        setData((prev) => ({
          ...prev,
          artworks: prev.artworks.map((a) => (a.id === id ? { ...a, ...payload } : a)),
        })),

      deleteArtwork: async (id) => {
        if (USE_API) {
          try {
            // DELETE /api/artworks?id=...
            const res = await fetch(`/api/artworks?id=${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Delete failed');

            // DOĞRU YÖNTEM: Silme sonrası veriyi tazeleyin
            const freshData = await ApiDataService.load();
            setData(freshData);
          } catch (e) {
            alert('Silme işlemi başarısız');
          }
        } else {
          setData((prev) => ({
            ...prev,
            artworks: prev.artworks.filter((a) => a.id !== id),
          }));
        }
      },
      addExhibition: (payload) =>
        setData((prev) => ({
          ...prev,
          exhibitions: [...prev.exhibitions, { ...payload, id: nextId(prev.exhibitions) }],
        })),
      updateExhibition: (id, payload) =>
        setData((prev) => ({
          ...prev,
          exhibitions: prev.exhibitions.map((e) => (e.id === id ? { ...e, ...payload } : e)),
        })),
      deleteExhibition: (id) =>
        setData((prev) => ({
          ...prev,
          exhibitions: prev.exhibitions.filter((e) => e.id !== id),
        })),
      updateCv: (payload) =>
        setData((prev) => ({
          ...prev,
          cv: { ...prev.cv, ...payload },
        })),
      updateContactInfo: (payload) =>
        setData((prev) => ({
          ...prev,
          contactInfo: { ...prev.contactInfo, ...payload },
        })),
      setFeaturedArtwork: (artworkId) =>
        setData((prev) => ({
          ...prev,
          featuredArtworkId: artworkId,
        })),
      resetData: () => {
        if (confirm('Tüm verileri silip varsayılanlara dönmek istediğinize emin misiniz?')) {
          DataService.reset();
          setData(DEFAULT_DATA);
        }
      }
    }),
    []
  );

  return { data, setData, ...helpers, isInitialized };
}

// Public Hook - Sadece okur (ve değişiklikleri dinler)
export function usePublicData() {
  const [data, setData] = useState(() => DataService.load());

  useEffect(() => {
    const handleStorage = (e) => {
      // Başka sekmelerden gelen değişiklikleri dinle
      if (e.key === STORAGE_KEY) {
        setData(DataService.load());
      }
    };

    // Aynı sekme içindeki değişiklikleri dinle (DataService.save'de tetiklenir)
    const handleLocalUpdate = () => {
      setData(DataService.load());
    }

    window.addEventListener('storage', handleStorage);
    window.addEventListener('local-data-update', handleLocalUpdate);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('local-data-update', handleLocalUpdate);
    };
  }, []);

  return data;
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
