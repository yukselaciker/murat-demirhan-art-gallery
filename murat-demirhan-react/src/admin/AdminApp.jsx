// ============================================
// ADMIN APP - MURAT DEMİRHAN PORTFOLYO
// Basit giriş + sekmeli yönetim paneli
// GERÇEK PROJEDE ŞİFRE SABİT TUTULMAMALIDIR, ORTAM DEĞİŞKENİNE ALINMALIDIR.
// ============================================

import { useEffect, useMemo, useState } from 'react';
import AdminLogin from './AdminLogin.jsx';
import AdminLayout from './AdminLayout.jsx';
import ArtworksPanel from './ArtworksPanel.jsx';
import ExhibitionsPanel from './ExhibitionsPanel.jsx';
import CvPanel from './CvPanel.jsx';
import SettingsPanel from './SettingsPanel.jsx';
import '../styles/admin.css';

const STORAGE_KEY = 'md-admin-session';
// Environment variables'dan kullanıcı adı ve şifre okunur
const USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
const PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'murat2025!';

export default function AdminApp() {
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
    } catch {
      return null;
    }
  });
  const [activeTab, setActiveTab] = useState('artworks');

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [session]);

  const handleLogin = (username, password) => {
    if (username === USERNAME && password === PASSWORD) {
      const payload = { user: USERNAME, ts: Date.now() };
      setSession(payload);
    } else {
      return 'Kullanıcı adı veya şifre hatalı';
    }
    return null;
  };

  const handleLogout = () => {
    setSession(null);
  };

  const tabs = useMemo(
    () => [
      { key: 'artworks', label: 'Eserler' },
      { key: 'exhibitions', label: 'Sergiler' },
      { key: 'cv', label: 'Özgeçmiş / CV' },
      { key: 'settings', label: 'Ayarlar' },
    ],
    []
  );

  if (!session) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <AdminLayout tabs={tabs} activeTab={activeTab} onSelectTab={setActiveTab} onLogout={handleLogout}>
      {activeTab === 'artworks' && <ArtworksPanel />}
      {activeTab === 'exhibitions' && <ExhibitionsPanel />}
      {activeTab === 'cv' && <CvPanel />}
      {activeTab === 'settings' && <SettingsPanel />}
    </AdminLayout>
  );
}
