// ============================================
// APP.JSX - MURAT DEMİRHAN PORTFOLYO
// Ana uygulama bileşeni
// ============================================

import { useEffect } from 'react';

// CRITICAL: Import DataContext FIRST - it starts fetching immediately!
import { DataProvider } from './context/DataContext';

// Other contexts (no blocking operations)
import { useRef } from 'react';
import { useLanguage } from './context/LanguageContext';
import { useData } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Gallery from './components/sections/Gallery';
import Exhibitions from './components/sections/Exhibitions';
import Contact from './components/sections/Contact';
import CookieBanner from './components/ui/CookieBanner';

// Styles
import './styles/index.css';

function App() {
  // Initialize security AFTER first paint using requestIdleCallback
  // This prevents security scripts from blocking data fetch
  useEffect(() => {
    const initSecurity = async () => {
      // Dynamically import security modules to avoid blocking initial load
      const [securityModule, screenshotModule] = await Promise.all([
        import('./utils/security'),
        import('./utils/screenshotProtection')
      ]);

      securityModule.initSecurityProtection();
      screenshotModule.initScreenshotProtection();
    };

    // Use requestIdleCallback if available, otherwise setTimeout
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => initSecurity());
    } else {
      setTimeout(initSecurity, 100);
    }

    // Scroll animations - run after data is visible
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
    const timer = setTimeout(observeElements, 100);

    // [SAFETY NET] Fallback for visibility
    const fallbackTimer = setTimeout(() => {
      const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
      elements.forEach(el => el.classList.add('visible'));
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <DataProvider>
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
        </DataProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
