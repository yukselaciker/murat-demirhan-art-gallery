import { useState } from 'react';

export default function AdminLayout({ tabs, activeTab, onSelectTab, onLogout, children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="admin-shell">
      <button
        className="mobile-menu-toggle"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Menüyü Aç/Kapat"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {isMenuOpen ? (
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <aside className={`admin-sidebar ${isMenuOpen ? 'open' : ''}`}>
        <nav className="admin-nav">
          {tabs.filter(t => t.key !== 'settings').map((tab) => (
            <button
              key={tab.key}
              className={`nav-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => onSelectTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="spacer"></div>

        {/* Settings Tab - Pushed to bottom */}
        {tabs.find(t => t.key === 'settings') && (
          <button
            className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => onSelectTab('settings')}
            style={{ marginBottom: '0.5rem' }}
          >
            {tabs.find(t => t.key === 'settings').label}
          </button>
        )}

        <button className="btn ghost logout-btn" onClick={onLogout}>
          Çıkış
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>{tabs.find((t) => t.key === activeTab)?.label}</h1>
        </header>
        <section className="admin-content">{children}</section>
      </main>
    </div>
  );
}

