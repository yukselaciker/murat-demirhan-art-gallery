// ============================================
// MAIN.JSX - MURAT DEMİRHAN PORTFOLYO
// React uygulaması giriş noktası
// OPTIMIZED: Lazy load admin, immediate data fetch
// ============================================

import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';

// CRITICAL: Import DataContext FIRST to start fetching IMMEDIATELY
// This runs before anything else and starts the Promise.all for APIs
import './context/DataContext';

// Check if admin path BEFORE importing anything else
const isAdmin = window.location.pathname.startsWith('/studio-md-2024');

// Only load what we need - lazy load admin to avoid loading siteData.js on public site
const App = lazy(() => import('./App.jsx'));
const AdminApp = isAdmin ? lazy(() => import('./admin/AdminApp.jsx')) : null;

// Simple loading fallback
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontFamily: 'system-ui, sans-serif',
    color: '#666'
  }}>
    Yükleniyor...
  </div>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<LoadingFallback />}>
      {isAdmin && AdminApp ? <AdminApp /> : <App />}
    </Suspense>
  </StrictMode>
);
