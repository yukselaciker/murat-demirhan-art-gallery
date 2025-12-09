// ============================================
// ORTAK VERİ KATMANI - MURAT DEMİRHAN PORTFOLYO
// Ana site ve admin panel aynı kaynaktan okur/yazar
// GERÇEK PROJEDE VERİLER BİR VERİTABANINDA SAKLANMALIDIR.
// ============================================

import { useEffect, useMemo, useState } from 'react';

// Görsel path yardımcı (build/base uyumlu)
const imagePath = (fileName) => `${import.meta.env.BASE_URL}images/${fileName}`;

// Varsayılan veri (ilk kurulum)
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
      description:
        'Deniz kenarındaki taş duvarın önünde, mavi bisikletiyle duran ve parmağıyla ufku işaret eden bir çocuk.',
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
      description:
        'Karanlık bir mekanda tandırın sıcak ışığıyla aydınlanan, ekmek pişiren Anadolu kadınları.',
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
      description:
        'Sokakta yere çömelmiş, dikkatle misket oynayan üç çocuk. Turkuaz kapı ve duvar dokusu sahneye canlılık katıyor.',
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
      description:
        'Geleneksel Efe kıyafetleri içinde, elinde tüfeğiyle mağrur bir duruş sergileyen figür.',
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
    artistPhoto: '', // Sanatçı portresi (base64 data URL veya image URL)
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
    phone: '', // Opsiyonel
  },
  featuredArtworkId: null, // Öne çıkan eser ID'si (gelecekte kullanılacak)
};

const STORAGE_KEY = 'md-site-data';

export function loadSiteData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DATA;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_DATA,
      ...parsed,
      artworks: parsed.artworks || DEFAULT_DATA.artworks,
      exhibitions: parsed.exhibitions || DEFAULT_DATA.exhibitions,
      cv: parsed.cv || DEFAULT_DATA.cv,
      contactInfo: parsed.contactInfo || DEFAULT_DATA.contactInfo,
      featuredArtworkId: parsed.featuredArtworkId ?? DEFAULT_DATA.featuredArtworkId,
    };
  } catch (e) {
    console.warn('Veri okunamadı, varsayılanlar kullanılacak', e);
    return DEFAULT_DATA;
  }
}

export function saveSiteData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Veri kaydedilemedi', e);
  }
}

// Ortak hook: hem admin hem public okuyabilir
export function useSiteData() {
  const [data, setData] = useState(loadSiteData);

  // State her değiştiğinde localStorage'a yaz
  useEffect(() => {
    saveSiteData(data);
    // TODO: GERÇEK PROJEDE VERİTABANINA YAZILMALI.
  }, [data]);

  // Basit id üretici
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
    }),
    []
  );

  return { data, setData, ...helpers };
}

// Sadece okuma için hafif hook
export function usePublicData() {
  const [data, setData] = useState(() => loadSiteData());

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        setData(loadSiteData());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return data;
}

export default {
  useSiteData,
  usePublicData,
  loadSiteData,
  saveSiteData,
};
