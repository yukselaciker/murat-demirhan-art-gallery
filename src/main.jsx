// ============================================
// MAIN.JSX - MURAT DEMİRHAN PORTFOLYO
// React uygulaması giriş noktası
// ============================================

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import AdminApp from './admin/AdminApp.jsx';

// Admin paneli güvenli bir route'ta render et
// Güvenlik için tahmin edilemez bir path kullanılıyor
const isAdmin = window.location.pathname.startsWith('/studio-md-2024');

// React Query Setup
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes cache (data considered fresh)
      cacheTime: 30 * 60 * 1000, // 30 minutes in memory (unused data)
      refetchOnWindowFocus: false, // Don't refetch when switching tabs (prevents flashing)
      retry: 1, // Only retry failed requests once
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {isAdmin ? <AdminApp /> : <App />}
    </QueryClientProvider>
  </StrictMode>
);
