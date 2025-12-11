import { useMemo, useState } from 'react';

export default function AdminLayout({ tabs, activeTab, onSelectTab, onLogout, children }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const icons = useMemo(
    () => ({
      artworks: '🎨',
      exhibitions: '🏛️',
      cv: '📄',
      messages: '✉️',
      settings: '⚙️',
      default: '📍'
    }),
    []
  );

  const getIcon = (key) => icons[key] || icons.default;

  const handleTabSelect = (key) => {
    onSelectTab(key);
    setIsMobileNavOpen(false);
  };

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${isMobileNavOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-top">
          <div className="admin-brand">
            <div className="brand-mark">MD</div>
            <div className="brand-text">
              <span className="brand-name">Murat Demirhan</span>
              <span className="brand-tagline">Studio Admin</span>
            </div>
          </div>

          <button
            className="nav-toggle"
            onClick={() => setIsMobileNavOpen((prev) => !prev)}
            aria-label="Yan menüyü aç/kapat"
            aria-expanded={isMobileNavOpen}
          >
            {isMobileNavOpen ? '✕' : '☰'}
          </button>
        </div>

        <nav className="admin-nav">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`nav-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => handleTabSelect(tab.key)}
            >
              <span className="nav-icon">{getIcon(tab.key)}</span>
              <span className="nav-label">{tab.label}</span>
            </button>
          ))}

          <div className="nav-spacer" />

          <button className="nav-btn logout" onClick={onLogout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Çıkış</span>
          </button>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <p className="admin-eyebrow">Kontrol Paneli</p>
            <h1>{tabs.find((t) => t.key === activeTab)?.label}</h1>
          </div>
        </header>
        <section className="admin-content">{children}</section>
      </main>
    </div>
  );
}


