/* ============================================
   MURAT DEMİRHAN SANAT GALERİSİ
   Ana JavaScript Dosyası - Gelişmiş Özellikler
   ============================================ */

// ============================================
// 1. GALERİ VERİSİ
// Buraya yeni eserler eklenecek - sadece bu array'e obje eklemek yeterli
// ============================================
const artworks = [
  // ============================================
  // GERÇEK ESERLER - Yüklenen görseller
  // ============================================
  {
    id: 1,
    title: "Bisikletli Çocuk",
    year: 2024,
    technique: "Tuval üzerine yağlı boya",
    size: "60x80 cm",
    category: "figuratif",
    tags: ["çocuk", "bisiklet", "masumiyet", "sokak", "çocukluk"],
    description: "Mavi bisikletinin yanında duran küçük çocuğun masumiyetini ve çocukluk günlerinin saf güzelliğini yakalayan etkileyici bir portre. Sıcak toprak tonları ve turkuaz mavinin uyumu, nostaljik bir atmosfer yaratıyor.",
    status: "Özel Koleksiyon",
    imagePlaceholder: false,
    image: "images/bisikletli-cocuk.jpg"
  },
  {
    id: 2,
    title: "Tandır Başında",
    year: 2023,
    technique: "Tuval üzerine yağlı boya",
    size: "100x70 cm",
    category: "figuratif",
    tags: ["gelenek", "anadolu", "ekmek", "köy", "kadın", "kültür"],
    description: "Anadolu'nun kadim geleneğini yansıtan bu eser, tandır başında ekmek yapan kadınları betimliyor. Ateşin sıcak ışığı yüzlere vuruyor ve geleneksel yaşamın samimiyetini gözler önüne seriyor.",
    status: "Satılık",
    imagePlaceholder: false,
    image: "images/ekmek-yapan-kadinlar.jpg"
  },
  {
    id: 3,
    title: "Atlı Savaşçılar",
    year: 2022,
    technique: "Tuval üzerine yağlı boya",
    size: "120x80 cm",
    category: "figuratif",
    tags: ["at", "savaş", "tarih", "osmanlı", "hareket", "dinamizm"],
    description: "Tarihin derinliklerinden gelen atlı savaşçıların dramatik bir aksiyon sahnesi. Atların hareketliliği ve savaşçıların cesareti, dinamik fırça darbeleriyle tuval üzerine aktarılmış.",
    status: "Müze Koleksiyonu",
    imagePlaceholder: false,
    image: "images/atli-savascilar.jpg"
  },
  {
    id: 4,
    title: "Geleneksel Adam",
    year: 2023,
    technique: "Tuval üzerine yağlı boya",
    size: "70x90 cm",
    category: "figuratif",
    tags: ["portre", "gelenek", "kültür", "anadolu", "zeybek", "folklor"],
    description: "Geleneksel Anadolu kıyafetleri içinde etkileyici bir erkek portresi. Renkli giysiler ve karakteristik başlık, kültürel mirasın canlı bir temsili olarak karşımıza çıkıyor.",
    status: "Satılık",
    imagePlaceholder: false,
    image: "images/geleneksel-adam.jpg"
  },
  {
    id: 5,
    title: "Misket Oyunu",
    year: 2024,
    technique: "Tuval üzerine yağlı boya",
    size: "80x100 cm",
    category: "figuratif",
    tags: ["çocuk", "oyun", "misket", "sokak", "nostalji", "arkadaşlık"],
    description: "Sokakta misket oynayan çocukların heyecanlı anlarını yakalayan bu eser, geçmişin sokak oyunlarına ve çocukluğun saf arkadaşlıklarına nostaljik bir bakış sunuyor.",
    status: "Özel Koleksiyon",
    imagePlaceholder: false,
    image: "images/misket-oynayan-cocuklar.jpg"
  },
  // ============================================
  // PLACEHOLDER ESERLER - Gelecekte eklenecek
  // ============================================
  {
    id: 6,
    title: "Sessiz Sokaklar",
    year: 2024,
    technique: "Tuval üzerine yağlı boya",
    size: "80x120 cm",
    category: "soyut",
    tags: ["şehir", "yalnızlık", "mavi", "gri"],
    description: "Şehrin gürültüsünden uzak, hafızanın derinliklerinde saklı kalan sessiz anları betimleyen soyut bir kompozisyon.",
    status: "Özel Koleksiyon",
    imagePlaceholder: true
  },
  {
    id: 7,
    title: "Anadolu Stebi",
    year: 2021,
    technique: "Tuval üzerine yağlı boya",
    size: "140x100 cm",
    category: "peyzaj",
    tags: ["anadolu", "step", "doğa", "sonsuzluk"],
    description: "Anadolu'nun uçsuz bucaksız ovalarını betimleyen geniş format bir peyzaj.",
    status: "Satılık",
    imagePlaceholder: true
  },
  {
    id: 8,
    title: "Kapadokya Işıkları",
    year: 2020,
    technique: "Tuval üzerine yağlı boya",
    size: "100x80 cm",
    category: "peyzaj",
    tags: ["kapadokya", "peri bacaları", "ışık", "gün batımı"],
    description: "Kapadokya'nın eşsiz jeolojik formasyonlarını gün batımı ışığında betimleyen etkileyici bir peyzaj.",
    status: "Satılık",
    imagePlaceholder: true
  }
];

// ============================================
// 2. SERGİ VERİSİ
// Buraya yeni sergiler eklenecek
// ============================================
const exhibitions = [
  {
    year: "2024",
    title: "Hafızanın Renkleri",
    location: "İstanbul",
    venue: "Pera Müzesi",
    description: "Kişisel sergi - 35 eserden oluşan kapsamlı retrospektif",
    type: "Kişisel Sergi"
  },
  {
    year: "2023",
    title: "Çağdaş Türk Sanatı",
    location: "Berlin",
    venue: "Galerie Kunst",
    description: "Uluslararası karma sergi - 5 eser ile katılım",
    type: "Karma Sergi"
  },
  {
    year: "2022",
    title: "Şehir ve Yalnızlık",
    location: "Ankara",
    venue: "CerModern",
    description: "Tematik grup sergisi - 8 eser ile katılım",
    type: "Grup Sergisi"
  },
  {
    year: "2021",
    title: "Genç Ustalar",
    location: "İzmir",
    venue: "İzmir Sanat Galerisi",
    description: "Davetli sanatçı sergisi - 12 eser ile katılım",
    type: "Davetli Sergi"
  },
  {
    year: "2020",
    title: "İç Sesler",
    location: "İstanbul",
    venue: "Arter",
    description: "Kişisel sergi - 20 yeni eser",
    type: "Kişisel Sergi"
  },
  {
    year: "2019",
    title: "Contemporary Istanbul",
    location: "İstanbul",
    venue: "Lütfi Kırdar Kongre Merkezi",
    description: "Uluslararası sanat fuarı - Galeri temsili",
    type: "Sanat Fuarı"
  }
];

// ============================================
// 3. DOM ELEMENTLERİ
// ============================================
const header = document.getElementById('header');
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelectorAll('.nav__link');
const themeToggle = document.getElementById('themeToggle');
const galleryGrid = document.getElementById('galleryGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('gallerySearch');
const timeline = document.getElementById('timeline');
const lightbox = document.getElementById('lightbox');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

// ============================================
// 4. GLOBAL DEĞİŞKENLER
// ============================================
let currentFilter = 'all';
let currentSearchTerm = '';
let currentArtworkIndex = 0;
let filteredArtworks = [...artworks];
let previouslyFocusedElement = null;

// ============================================
// 5. SAYFA YÜKLENDİĞİNDE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderGallery(artworks);
  renderTimeline(exhibitions);
  initScrollAnimations();
  initSmoothScroll();
});

// ============================================
// 6. LIGHT/DARK MODE
// localStorage ile tema tercihi saklanır
// ============================================
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (prefersDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
}

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

// ============================================
// 7. HEADER SCROLL EFEKTİ
// ============================================
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ============================================
// 8. MOBİL MENÜ TOGGLE
// ============================================
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  nav.classList.toggle('active');
});

// Menü linki tıklandığında mobil menüyü kapat
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    nav.classList.remove('active');
  });
});

// ============================================
// 9. YUMUŞAK SCROLL (Smooth Scroll)
// ============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ============================================
// 10. GALERİ RENDER FONKSİYONU
// ============================================
function renderGallery(artworksToRender) {
  galleryGrid.innerHTML = '';

  if (artworksToRender.length === 0) {
    galleryGrid.innerHTML = `
      <div class="gallery__no-results">
        <p>Aramanızla eşleşen eser bulunamadı.</p>
      </div>
    `;
    return;
  }

  artworksToRender.forEach((artwork) => {
    const card = document.createElement('div');
    card.className = 'artwork-card';
    card.setAttribute('data-category', artwork.category);
    card.setAttribute('data-id', artwork.id);
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `${artwork.title} - Detayları görmek için tıklayın`);

    card.innerHTML = `
      <div class="artwork-card__image-wrapper">
        ${artwork.imagePlaceholder ? `
          <!-- Buraya gerçek eser görseli eklenecek -->
          <div class="placeholder-image">
            <svg class="placeholder-image__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span class="placeholder-image__text">${artwork.title}</span>
          </div>
        ` : `
          <img 
            src="${artwork.image}" 
            alt="${artwork.title} - ${artwork.technique}" 
            class="artwork-card__image"
            loading="lazy"
          >
        `}
        <div class="artwork-card__overlay">
          <span class="artwork-card__view-text">Detayları Gör</span>
        </div>
      </div>
      <div class="artwork-card__info">
        <h3 class="artwork-card__title">${artwork.title}</h3>
        <p class="artwork-card__details">${artwork.year} • ${artwork.technique}</p>
        <p class="artwork-card__details">${artwork.size}</p>
        <span class="artwork-card__category">${getCategoryLabel(artwork.category)}</span>
      </div>
    `;

    // Kart tıklama eventi - Lightbox aç
    card.addEventListener('click', () => {
      currentArtworkIndex = filteredArtworks.findIndex(a => a.id === artwork.id);
      openLightbox(artwork);
    });

    // Klavye erişilebilirliği
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        currentArtworkIndex = filteredArtworks.findIndex(a => a.id === artwork.id);
        openLightbox(artwork);
      }
    });

    galleryGrid.appendChild(card);
  });

  // Stagger animasyonunu tetikle
  setTimeout(() => {
    galleryGrid.classList.add('visible');
  }, 100);
}

// Kategori etiketlerini Türkçe'ye çevir
function getCategoryLabel(category) {
  const labels = {
    'soyut': 'Soyut',
    'figuratif': 'Figüratif',
    'peyzaj': 'Peyzaj'
  };
  return labels[category] || category;
}

// ============================================
// 11. GALERİ FİLTRELEME VE ARAMA
// ============================================
function filterAndSearchArtworks() {
  filteredArtworks = artworks.filter(artwork => {
    // Kategori filtresi
    const matchesCategory = currentFilter === 'all' || artwork.category === currentFilter;

    // Arama filtresi
    const searchLower = currentSearchTerm.toLowerCase();
    const matchesSearch = currentSearchTerm === '' ||
      artwork.title.toLowerCase().includes(searchLower) ||
      (artwork.tags && artwork.tags.some(tag => tag.toLowerCase().includes(searchLower)));

    return matchesCategory && matchesSearch;
  });

  // Galeri grid'ini temizle ve yeniden render et
  galleryGrid.classList.remove('visible');
  setTimeout(() => {
    renderGallery(filteredArtworks);
  }, 300);
}

// Filtre butonları
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Aktif butonu güncelle
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    currentFilter = button.getAttribute('data-filter');
    filterAndSearchArtworks();
  });
});

// Arama kutusu
searchInput.addEventListener('input', debounce((e) => {
  currentSearchTerm = e.target.value.trim();
  filterAndSearchArtworks();
}, 300));

// ============================================
// 12. LIGHTBOX / MODAL - GELİŞMİŞ
// ============================================
function openLightbox(artwork) {
  // Önceki focus'u kaydet (erişilebilirlik için)
  previouslyFocusedElement = document.activeElement;

  // Lightbox resim alanını güncelle
  const imageWrapper = document.querySelector('.lightbox__image-wrapper');
  if (artwork.imagePlaceholder || !artwork.image) {
    // Placeholder göster
    imageWrapper.innerHTML = `
      <div class="placeholder-image" id="lightboxImage">
        <svg class="placeholder-image__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <span class="placeholder-image__text">${artwork.title}</span>
      </div>
    `;
  } else {
    // Gerçek resmi göster
    imageWrapper.innerHTML = `
      <img 
        src="${artwork.image}" 
        alt="${artwork.title} - ${artwork.technique}" 
        class="lightbox__image"
        id="lightboxImage"
      >
    `;
  }

  // Lightbox metin içeriğini güncelle
  document.getElementById('lightboxTitle').textContent = artwork.title;
  document.getElementById('lightboxYear').textContent = artwork.year;
  document.getElementById('lightboxTechnique').textContent = artwork.technique;
  document.getElementById('lightboxSize').textContent = artwork.size;
  document.getElementById('lightboxDescription').textContent = artwork.description;
  document.getElementById('lightboxStatus').textContent = artwork.status;

  // Navigasyon butonlarının durumunu güncelle
  updateLightboxNavigation();

  // Lightbox'ı göster
  lightbox.classList.add('active');
  document.body.classList.add('no-scroll');

  // Focus'u lightbox'a taşı
  setTimeout(() => {
    lightboxClose.focus();
  }, 100);
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.classList.remove('no-scroll');

  // Focus'u önceki elemente geri döndür
  if (previouslyFocusedElement) {
    previouslyFocusedElement.focus();
  }
}

function updateLightboxNavigation() {
  // İlk eser ise önceki butonu devre dışı bırak
  lightboxPrev.disabled = currentArtworkIndex === 0;

  // Son eser ise sonraki butonu devre dışı bırak
  lightboxNext.disabled = currentArtworkIndex === filteredArtworks.length - 1;
}

function showPreviousArtwork() {
  if (currentArtworkIndex > 0) {
    currentArtworkIndex--;
    openLightbox(filteredArtworks[currentArtworkIndex]);
  }
}

function showNextArtwork() {
  if (currentArtworkIndex < filteredArtworks.length - 1) {
    currentArtworkIndex++;
    openLightbox(filteredArtworks[currentArtworkIndex]);
  }
}

// Lightbox event listeners
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPreviousArtwork);
lightboxNext.addEventListener('click', showNextArtwork);

// Lightbox dışına tıklayınca kapat
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

// Klavye kontrolleri
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;

  switch (e.key) {
    case 'Escape':
      closeLightbox();
      break;
    case 'ArrowLeft':
      showPreviousArtwork();
      break;
    case 'ArrowRight':
      showNextArtwork();
      break;
  }
});

// ============================================
// 13. TİMELİNE RENDER FONKSİYONU
// ============================================
function renderTimeline(exhibitionsToRender) {
  timeline.innerHTML = '';

  exhibitionsToRender.forEach((exhibition) => {
    const item = document.createElement('div');
    item.className = 'timeline__item fade-in';

    item.innerHTML = `
      <div class="timeline__marker"></div>
      <div class="timeline__date">${exhibition.year}</div>
      <div class="timeline__content">
        <h3 class="timeline__title">${exhibition.title}</h3>
        <p class="timeline__location">${exhibition.venue}, ${exhibition.location}</p>
        <p class="timeline__description">${exhibition.description}</p>
        ${exhibition.type ? `<span class="timeline__type">${exhibition.type}</span>` : ''}
      </div>
    `;

    timeline.appendChild(item);
  });
}

// ============================================
// 14. SCROLL ANİMASYONLARI (Intersection Observer)
// ============================================
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .stagger');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Bir kez animasyon oynadıktan sonra gözlemlemeyi bırak
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

// ============================================
// 15. İLETİŞİM FORMU VALİDASYONU
// ============================================
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Tüm hata durumlarını temizle
  const formGroups = contactForm.querySelectorAll('.form__group');
  formGroups.forEach(group => group.classList.remove('error'));

  // Form verilerini al
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  let isValid = true;

  // İsim validasyonu
  if (!name) {
    document.getElementById('name').parentElement.classList.add('error');
    isValid = false;
  }

  // E-posta validasyonu
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    document.getElementById('email').parentElement.classList.add('error');
    isValid = false;
  }

  // Mesaj validasyonu
  if (!message) {
    document.getElementById('message').parentElement.classList.add('error');
    isValid = false;
  }

  // Form geçerliyse
  if (isValid) {
    // ============================================
    // Backend entegrasyonu burada yapılacak
    // Örnek: Formspree, EmailJS veya backend API
    // 
    // fetch('https://formspree.io/f/xxxxx', {
    //   method: 'POST',
    //   body: new FormData(contactForm),
    //   headers: { 'Accept': 'application/json' }
    // })
    // .then(response => { ... })
    // .catch(error => { ... });
    // ============================================

    // Formu gizle ve başarı mesajını göster
    const formElements = contactForm.querySelectorAll('.form__group, .form__submit');
    formElements.forEach(el => el.style.display = 'none');
    formSuccess.classList.add('show');

    // 5 saniye sonra formu tekrar göster (opsiyonel)
    setTimeout(() => {
      contactForm.reset();
      formElements.forEach(el => el.style.display = '');
      formSuccess.classList.remove('show');
    }, 5000);
  }
});

// ============================================
// 16. YARDIMCI FONKSİYONLAR
// ============================================

// Debounce fonksiyonu (arama için performans)
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
