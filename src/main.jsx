// ============================================
// MAIN.JSX - MURAT DEMİRHAN PORTFOLYO
// React uygulaması giriş noktası
// ============================================

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// CRITICAL: Import DataContext FIRST to start fetching IMMEDIATELY
// This import triggers the module-level startFetching() call
import './context/DataContext';

// Then load the app components
import App from './App.jsx';
import AdminApp from './admin/AdminApp.jsx';

// Admin paneli güvenli bir route'ta render et
// Güvenlik için tahmin edilemez bir path kullanılıyor
const isAdmin = window.location.pathname.startsWith('/studio-md-2024');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isAdmin ? <AdminApp /> : <App />}
  </StrictMode>
);
