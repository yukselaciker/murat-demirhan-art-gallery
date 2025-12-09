# Murat Demirhan Sanat Galerisi

Modern, minimal ve premium hissiyatlı sanat galerisi portfolyo web sitesi.

## 🎨 Özellikler

- **Light/Dark Mode**: Sağ üstteki toggle ile tema değişimi, tercih localStorage'da saklanır
- **Responsive Tasarım**: Mobil, tablet ve desktop için optimize edilmiş
- **Galeri Filtreleme**: Soyut, Figüratif, Peyzaj kategorileri
- **Eser Arama**: Eser adı ve etiketlerde anlık arama
- **Lightbox Görünümü**: Büyük önizleme, ok tuşları ile navigasyon, ESC ile kapatma
- **Smooth Scroll**: Yumuşak sayfa geçişleri
- **Scroll Animasyonları**: Intersection Observer ile fade-in efektleri
- **Form Validasyonu**: Client-side doğrulama

## 📁 Dosya Yapısı

```
murat demirhan art gallery/
├── index.html          # Ana HTML dosyası
├── styles.css          # Tüm CSS stilleri (dark mode dahil)
├── script.js           # JavaScript işlevselliği
├── data/
│   └── artworks.js     # Eser ve sergi verileri
└── README.md           # Bu dosya
```

## 🚀 Kullanım

1. Projeyi herhangi bir web sunucusu ile açın (Live Server önerilir)
2. Veya doğrudan `index.html` dosyasını tarayıcıda açın

> **Not**: ES6 modülleri kullanıldığı için bazı tarayıcılarda doğrudan açmak çalışmayabilir. Live Server kullanmanız önerilir.

## 🖼️ Eser Ekleme/Güncelleme

`data/artworks.js` dosyasındaki `artworks` array'ine yeni obje ekleyin:

```javascript
{
  id: 11,                                    // Benzersiz ID
  title: "Eser Adı",                         // Eser başlığı
  year: 2024,                                // Yapım yılı
  technique: "Tuval üzerine yağlı boya",     // Teknik
  size: "100x80 cm",                         // Ölçüler
  category: "soyut",                         // Kategori: soyut, figuratif, peyzaj
  tags: ["etiket1", "etiket2"],              // Arama için etiketler
  description: "Eser açıklaması...",         // Detaylı açıklama
  status: "Satılık",                         // Durum bilgisi
  imagePlaceholder: true                     // Gerçek görsel için false yapın
  // image: "images/artworks/eser-adi.jpg"   // Gerçek görsel yolu
}
```

## 🖼️ Görsel Ekleme

1. `imagePlaceholder: true` satırını `imagePlaceholder: false` yapın
2. `image: "images/artworks/eser-adi.jpg"` satırını ekleyin
3. Görseli belirtilen klasöre ekleyin
4. Önerilen görsel boyutu: 800x1000px (4:5 oran)

## 📧 İletişim Formu

Form şu an client-side çalışmaktadır. Gerçek e-posta gönderimi için:

1. [Formspree](https://formspree.io) veya [EmailJS](https://www.emailjs.com) hesabı oluşturun
2. `script.js` dosyasındaki form submit bölümüne entegrasyon kodunu ekleyin

## 🎨 Özelleştirme

### Renkler
`styles.css` başındaki CSS değişkenlerini düzenleyin:
- `--color-accent`: Vurgu rengi
- `--color-bg-primary`: Ana arka plan
- `--color-text-primary`: Ana metin rengi

### Fontlar
Google Fonts linkini `index.html` içinde değiştirin.

## 📱 Tarayıcı Desteği

- Chrome (son 2 versiyon)
- Firefox (son 2 versiyon)
- Safari (son 2 versiyon)
- Edge (son 2 versiyon)

## 📄 Lisans

© 2025 Murat Demirhan. Tüm hakları saklıdır.
