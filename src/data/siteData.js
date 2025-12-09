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
const DataService = {
  // Veriyi Yükle (Safe Load)
  load: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        console.log('[DataService] No data found, using defaults.');
        return DEFAULT_DATA;
      }

      const parsed = JSON.parse(raw);

      // Validation / Merging Strategy
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
      console.error('[DataService] Error loading data, falling back to defaults:', e);
      return DEFAULT_DATA;
    }
  },

  // Veriyi Kaydet (Safe Save)
  save: (data) => {
    try {
      // Basic validation before save
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid data format');
      }

      const serialized = JSON.stringify(data);
      localStorage.setItem(STORAGE_KEY, serialized);

      // Dispatch storage event manually for same-tab listeners (optional but good practice)
      window.dispatchEvent(new Event('local-data-update'));
      return true;
    } catch (e) {
      console.error('[DataService] Failed to save data:', e);
      alert('Veri kaydedilirken hata oluştu! Tarayıcı hafızası dolu olabilir.');
      return false;
    }
  },

  // Veriyi Sıfırla
  reset: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (e) {
      return false;
    }
  }
};

// ============================================
// 3. HOOKS
// ============================================

// Admin Hook - Veriyi okur ve yazar
export function useSiteData() {
  // Lazy initialization to avoid reading localStorage on every render
  const [data, setData] = useState(() => DataService.load());
  const [isInitialized, setIsInitialized] = useState(false);

  // Initial load effect (double check)
  useEffect(() => {
    const validData = DataService.load();
    setData(validData);
    setIsInitialized(true);
  }, []);

  // Save on change
  // WARNING: We must ensure we don't save DEFAULT_DATA overwriting user data due to a race condition.
  // The 'isInitialized' flag helps ensure we only start saving after we've firmly loaded the data.
  useEffect(() => {
    if (isInitialized) {
      DataService.save(data);
    }
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
