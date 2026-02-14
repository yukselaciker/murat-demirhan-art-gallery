// ============================================
// ADMIN APP - MURAT DEMİRHAN PORTFOLYO
// Token guard + sebeli yönetim paneli
// ============================================

import { useEffect, useMemo, useState, useCallback } from 'react';
import AdminLayout from './AdminLayout.jsx';
import ArtworksPanel from './ArtworksPanel.jsx';
import ExhibitionsPanel from './ExhibitionsPanel.jsx';
import CvPanel from './CvPanel.jsx';
import SettingsPanel from './SettingsPanel.jsx';
import MessagesPanel from './MessagesPanel.jsx';
import UpdatesPanel from './UpdatesPanel.jsx';
import { hasAdminToken, setAdminToken, removeAdminToken, verifyAdminToken } from '../lib/feedApi';
import '../styles/admin.css';

const STORAGE_KEY = 'md-admin-session';

export default function AdminApp() {
  // Token guard state
  const [hasToken, setHasToken] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [tokenError, setTokenError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState('artworks');

  // Check for existing token on mount
  useEffect(() => {
    setHasToken(hasAdminToken());
    setIsLoading(false);
  }, []);

  // Handle token login with backend verification
  const handleTokenLogin = useCallback(async (e) => {
    e.preventDefault();

    const token = tokenInput.trim();
    if (!token) {
      setTokenError('Token gerekli');
      return;
    }

    setIsVerifying(true);
    setTokenError('');

    try {
      const result = await verifyAdminToken(token);

      if (result.valid) {
        setAdminToken(token);
        setHasToken(true);
        setTokenInput('');
      } else {
        setTokenError(result.error || 'Geçersiz token');
      }
    } catch (err) {
      setTokenError('Doğrulama hatası');
    } finally {
      setIsVerifying(false);
    }
  }, [tokenInput]);

  // Handle logout - clears token and reloads
  const handleLogout = useCallback(() => {
    removeAdminToken();
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }, []);

  const tabs = useMemo(
    () => [
      { key: 'artworks', label: 'Eserler' },
      { key: 'updates', label: 'Güncellemeler' },
      { key: 'exhibitions', label: 'Sergiler' },
      { key: 'cv', label: 'Özgeçmiş / CV' },
      { key: 'messages', label: 'Mesajlar' },
      { key: 'settings', label: 'Site Ayarları (YENİ)' },
    ],
    []
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="admin-guard-loading">
        <div className="admin-spinner"></div>
      </div>
    );
  }

  // No token - show minimal login
  if (!hasToken) {
    return (
      <div className="admin-token-login">
        <div className="token-login-card">
          <h2>Admin Panel</h2>
          <p className="token-login-hint">Erişim için admin token gerekli</p>

          <form onSubmit={handleTokenLogin}>
            <div className="form-group">
              <input
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Admin token"
                className="token-input"
                autoFocus
                autoComplete="current-password"
              />
            </div>

            {tokenError && (
              <div className="token-error">
                {tokenError}
              </div>
            )}

            <button type="submit" className="token-login-btn" disabled={isVerifying}>
              {isVerifying ? 'Doğrulanıyor...' : 'Giriş Yap'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Token exists - show admin panel
  return (
    <AdminLayout tabs={tabs} activeTab={activeTab} onSelectTab={setActiveTab} onLogout={handleLogout}>
      {activeTab === 'artworks' && <ArtworksPanel />}
      {activeTab === 'updates' && <UpdatesPanel />}
      {activeTab === 'exhibitions' && <ExhibitionsPanel />}
      {activeTab === 'cv' && <CvPanel />}
      {activeTab === 'messages' && <MessagesPanel />}
      {activeTab === 'settings' && <SettingsPanel />}
    </AdminLayout>
  );
}
