// ============================================
// APP.JSX - MURAT DEMİRHAN PORTFOLYO
// Ana uygulama bileşeni
// ============================================

import { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Gallery from './components/sections/Gallery';
import Exhibitions from './components/sections/Exhibitions';
import Contact from './components/sections/Contact';
import CookieBanner from './components/ui/CookieBanner';

// Güvenlik sistemleri
import { initSecurityProtection } from './utils/security';
import { initScreenshotProtection } from './utils/screenshotProtection';

import './styles/index.css';

function App() {
  // Sayfa yüklendiğinde güvenlik sistemlerini başlat
  useEffect(() => {
    // Sağ tık, kopyalama ve klavye kısayolları engelleme
    initSecurityProtection();

    // Screenshot algılama ve koruma
    initScreenshotProtection();

    // Scroll animasyonları için Intersection Observer
    const observeElements = () => {
      const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      elements.forEach(el => observer.observe(el));
    };

    // DOM yüklendikten sonra observer'ı başlat
    setTimeout(observeElements, 100);
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="app">
          <Header />

          <main>
            <Hero />
            <About />
            <Gallery />
            <Exhibitions />
            <Contact />
          </main>

          <Footer />

          <CookieBanner />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
