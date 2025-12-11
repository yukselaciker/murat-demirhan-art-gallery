import React from 'react';
import { AdminProvider, useAdmin } from '../context/AdminContext';
import { Layout } from '../components/admin/ui/Layout';
import AdminLogin from './AdminLogin';

// Import Panels (We will refactor these one by one)
import ArtworksPanel from './ArtworksPanel';
import ExhibitionsPanel from './ExhibitionsPanel';
import CvPanel from './CvPanel';
import MessagesPanel from './MessagesPanel';
import SettingsPanel from './SettingsPanel';

const AdminContent = () => {
  const { isAuthenticated, activeTab, setActiveTab, logout } = useAdmin();

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const tabs = [
    { key: 'artworks', label: 'Eserler', icon: '🎨' },
    { key: 'exhibitions', label: 'Sergiler', icon: '🏛️' },
    { key: 'cv', label: 'Özgeçmiş', icon: '📄' },
    { key: 'messages', label: 'Mesajlar', icon: '✉️' },
    { key: 'settings', label: 'Ayarlar', icon: '⚙️' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'artworks': return <ArtworksPanel />;
      case 'exhibitions': return <ExhibitionsPanel />;
      case 'cv': return <CvPanel />;
      case 'messages': return <MessagesPanel />;
      case 'settings': return <SettingsPanel />;
      default: return <ArtworksPanel />;
    }
  };

  return (
    <Layout
      tabs={tabs}
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      onLogout={logout}
    >
      {renderContent()}
    </Layout>
  );
};

export default function AdminApp() {
  return (
    <AdminProvider>
      <AdminContent />
    </AdminProvider>
  );
}
