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
  artworks: [
    {
      id: 1,
      title: 'Bisikletli Çocuk',
      year: 2024,
      technique: 'Tuval üzerine yağlı boya',
      size: '60x80 cm',
      category: 'figuratif',
      tags: ['çocuk', 'bisiklet', 'deniz', 'duvar', 'masumiyet'],
      description: 'Deniz kenarındaki taş duvarın önünde, mavi bisikletiyle duran ve parmağıyla ufku işaret eden bir çocuk.',
      status: 'collection',
      image: imagePath('bisikletli-cocuk.jpg'),
    },
    {
      id: 2,
      title: 'Tandır Başında',
      year: 2023,
      technique: 'Tuval üzerine yağlı boya',
      size: '100x70 cm',
      category: 'figuratif',
      tags: ['gelenek', 'anadolu', 'ekmek', 'köy', 'kadın', 'ateş'],
      description: 'Karanlık bir mekanda tandırın sıcak ışığıyla aydınlanan, ekmek pişiren Anadolu kadınları.',
      status: 'available',
      image: imagePath('tandir-basinda.jpg'),
    },
    {
      id: 3,
      title: 'Misket Oynayan Çocuklar',
      year: 2024,
      technique: 'Tuval üzerine yağlı boya',
      size: '80x100 cm',
      category: 'figuratif',
      tags: ['çocuk', 'oyun', 'misket', 'sokak', 'arkadaşlık', 'renkler'],
      description: 'Sokakta yere çömelmiş, dikkatle misket oynayan üç çocuk. Turkuaz kapı ve duvar dokusu sahneye canlılık katıyor.',
      status: 'collection',
      image: imagePath('misket-oynayan.jpg'),
    },
    {
      id: 4,
      title: "Efe'nin Duruşu",
      year: 2023,
      technique: 'Tuval üzerine yağlı boya',
      size: '70x90 cm',
      category: 'figuratif',
      tags: ['efe', 'zeybek', 'gelenek'],
      description: 'Geleneksel Efe kıyafetleri içinde, elinde tüfeğiyle mağrur bir duruş sergileyen figür.',
      status: 'available',
      image: imagePath('efe-zeybek.jpg'),
    },
    {
      id: 5,
      title: 'Mavi Kuşlar',
      year: 2024,
      technique: 'Tuval üzerine yağlı boya',
      size: '50x60 cm',
      category: 'peyzaj',
      tags: ['kuş', 'doğa', 'bahar'],
      description: 'Çiçek açmış bir ağacın dallarına tünemiş iki mavi kuş.',
      status: 'available',
      image: imagePath('mavi-kuslar.jpg'),
    },
  ],
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
// API modu sadece açıkça "true" girilirse aktif olsun; aksi halde LocalStorage kullanılır
const USE_API = import.meta.env.VITE_USE_API === 'true';

// ============================================
// 2. DATA SERVICE LAYER (Abstraction)
// ============================================

// LocalStorage Implementation (Mevcut)
const mergeWithDefaults = (raw) => {
  if (!raw || typeof raw !== 'object') return DEFAULT_DATA;

  return {
    artworks: Array.isArray(raw.artworks) ? raw.artworks : DEFAULT_DATA.artworks,
    exhibitions: Array.isArray(raw.exhibitions) ? raw.exhibitions : DEFAULT_DATA.exhibitions,
    cv: raw.cv ? { ...DEFAULT_DATA.cv, ...raw.cv } : DEFAULT_DATA.cv,
    contactInfo: raw.contactInfo ? { ...DEFAULT_DATA.contactInfo, ...raw.contactInfo } : DEFAULT_DATA.contactInfo,
    featuredArtworkId: raw.featuredArtworkId !== undefined ? raw.featuredArtworkId : DEFAULT_DATA.featuredArtworkId,
  };
};

const LocalDataService = {
  load: async () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_DATA;

      const parsed = JSON.parse(raw);
      return mergeWithDefaults(parsed);
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

      const res = await fetch('/api/site-data');
      if (!res.ok) throw new Error(`API Error (${res.status})`);

      const payload = await res.json();
      return mergeWithDefaults(payload);
    } catch (e) {
      console.error('[ApiDataService] Load error:', e);
      throw e;
    }
  },

  save: async (data) => {
    try {
      const res = await fetch('/api/site-data', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`API save failed (${res.status})`);
      return true;
    } catch (e) {
      console.error('[ApiDataService] Save error:', e);
      return false;
    }
  },

  reset: async () => {
    try {
      await fetch('/api/site-data', { method: 'DELETE' });
      return true;
    } catch (e) {
      console.error('[ApiDataService] Reset error:', e);
      return false;
    }
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
    if (USE_API) return ApiDataService.load();
    return Promise.resolve(LocalDataService.load());
  },
  save: (data) => {
    if (USE_API) return ApiDataService.save(data);
    return LocalDataService.save(data);
  },
  reset: () => (USE_API ? ApiDataService.reset() : LocalDataService.reset())
};

// LocalDataService metodlarını senkron hale getirelim (orijinal kod senkrondu)
// Yukarıdaki async tanımlarını kaldırıp düzeltiyorum:
LocalDataService.load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DATA;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return DEFAULT_DATA;

    return mergeWithDefaults(parsed);
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
  const [data, setData] = useState(DEFAULT_DATA);

  const [isInitialized, setIsInitialized] = useState(false);

  // Veri Yükleme (Async & Sync Desteği)
  useEffect(() => {
    const loadData = async () => {
      try {
        const validData = await DataService.load();
        setData(mergeWithDefaults(validData));
        setIsInitialized(true);
      } catch (err) {
        console.error("Data load failed:", err);
      }
    };
    loadData();
  }, []);

  // Save on change (Sadece LocalStorage modunda otomatik kaydet)
  useEffect(() => {
    if (!isInitialized) return;

    if (USE_API) {
      ApiDataService.save(data);
      return;
    }

    LocalDataService.save(data);
  }, [data, isInitialized]);

  // Helpers (CRUD Operations)
  const nextId = (arr) => (arr.length ? Math.max(...arr.map((i) => Number(i.id))) + 1 : 1);

  const helpers = useMemo(
    () => ({
      addArtwork: (payload) =>
        setData((prev) => ({
          ...prev,
          artworks: [...prev.artworks, { ...payload, id: nextId(prev.artworks) }],
        })),
      updateArtwork: (id, payload) =>
        setData((prev) => ({
          ...prev,
          artworks: prev.artworks.map((a) => (a.id === id ? { ...a, ...payload } : a)),
        })),

      deleteArtwork: (id) =>
        setData((prev) => ({
          ...prev,
          artworks: prev.artworks.filter((a) => a.id !== id),
        })),
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
  const [data, setData] = useState(DEFAULT_DATA);

  useEffect(() => {
    let isMounted = true;
    DataService.load()
      .then((loaded) => {
        if (isMounted) setData(mergeWithDefaults(loaded));
      })
      .catch((err) => console.error('Public data load failed:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (USE_API) return undefined;

    const handleStorage = (e) => {
      // Başka sekmelerden gelen değişiklikleri dinle
      if (e.key === STORAGE_KEY) {
        DataService.load().then((loaded) => setData(mergeWithDefaults(loaded)));
      }
    };

    // Aynı sekme içindeki değişiklikleri dinle (DataService.save'de tetiklenir)
    const handleLocalUpdate = () => {
      DataService.load().then((loaded) => setData(mergeWithDefaults(loaded)));
    };

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
