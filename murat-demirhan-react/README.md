# Murat Demirhan Portfolyo - React + Vite

Premium, modüler ve genişletilebilir sanatçı portfolyo web sitesi.

## 🚀 Hızlı Başlangıç

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusu
npm run dev

# Production build
npm run build
```

## ✨ Özellikler

- **React + Vite** - Hızlı geliştirme ve build
- **Modüler Yapı** - Yeniden kullanılabilir component'ler
- **Light/Dark Mode** - localStorage ile kayıt
- **Çok Dilli (TR/EN)** - Kolay genişletilebilir
- **Gelişmiş Galeri** - Filtreleme, arama, lightbox
- **Form Validasyonu** - Client-side kontroller
- **Responsive** - Mobil öncelikli tasarım
- **Güvenlik Sistemi** - Görsel koruma, filigran

## 📁 Yapı

```
src/
├── components/     # UI bileşenleri
├── context/        # Theme ve Language context
├── hooks/          # Custom React hooks
├── data/           # Eser, sergi, çeviri verileri
├── utils/          # Güvenlik ve yardımcı fonksiyonlar
└── styles/         # CSS değişkenleri ve stiller
```

## 🎨 Eser Ekleme

`src/data/artworks.js` dosyasını düzenleyin.

## 🔒 Güvenlik

- Sağ tık ve kopyalama engeli
- DevTools algılama
- Screenshot koruması
- Canvas tabanlı filigran sistemi

## 🔐 Admin Paneli

### Kurulum

1. **Environment Dosyası Oluşturun**

   `.env.example` dosyasını `.env` adıyla kopyalayın:
   ```bash
   cp .env.example .env
   ```

2. **Giriş Bilgilerini Ayarlayın**

   `.env` dosyasını açın ve kendi kullanıcı adı ve güçlü şifrenizi girin:
   ```env
   VITE_ADMIN_USERNAME=kendi-kullanici-adiniz
   VITE_ADMIN_PASSWORD=guclu-sifreniz-123!@#
   ```

   > ⚠️ **ÖNEMLİ**: `.env` dosyası Git'e eklenmez. Güvenlik için bu dosyayı asla paylaşmayın.

3. **Sunucuyu Yeniden Başlatın**

   Environment değişkenlerinin yüklenmesi için dev sunucusunu yeniden başlatın:
   ```bash
   npm run dev
   ```

### Kullanım

- **Erişim**: Tarayıcınızda `http://localhost:5173/admin` adresine gidin
- **Giriş**: `.env` dosyasında belirlediğiniz kullanıcı adı ve şifreyi kullanın  
- **Özellikler**:
  - ✅ Eser ekleme/düzenleme/silme
  - ✅ Sergi yönetimi
  - ✅ CV/Özgeçmiş düzenleme
  - ✅ Değişiklikler anında yansır

> 💡 **Not**: Admin paneline sitede hiçbir link bulunmaz. Sadece URL'yi bilen ve giriş bilgilerine sahip kişiler erişebilir.

### Vercel'de Admin Paneli Kurulumu

Projenizi Vercel'e deploy ettikten sonra admin paneline erişmek için:

1. **Vercel Dashboard'a Gidin**
   - Projenizi seçin
   - `Settings` → `Environment Variables` sekmesine tıklayın

2. **Environment Variables Ekleyin**
   ```
   VITE_ADMIN_USERNAME = kendi-kullanici-adiniz
   VITE_ADMIN_PASSWORD = guclu-sifreniz-123!@#
   ```
   - Her iki değişkeni de ekleyin
   - Environment: `Production`, `Preview`, `Development` (hepsini seçin)

3. **Projeyi Yeniden Deploy Edin**
   - `Deployments` sekmesine gidin
   - En son deployment'ın yanındaki `...` menüsünden `Redeploy` seçin

4. **Admin Paneline Erişin**
   - Tarayıcıda: `https://your-domain.vercel.app/admin`
   - Vercel dashboard'da ayarladığınız kullanıcı adı ve şifreyle giriş yapın

> ⚠️ **GÜVENLİK**: Production şifrenizi güçlü tutun ve kimseyle paylaşmayın!

## 📄 Lisans

© 2025 Murat Demirhan. Tüm hakları saklıdır.
