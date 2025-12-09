// ============================================
// MAIN.JSX - MURAT DEMİRHAN PORTFOLYO
// React uygulaması giriş noktası
// ============================================

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import AdminApp from './admin/AdminApp.jsx';

const isAdmin = window.location.pathname.startsWith('/admin');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isAdmin ? <AdminApp /> : <App />}
  </StrictMode>
);
