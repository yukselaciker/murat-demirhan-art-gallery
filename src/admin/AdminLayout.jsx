export default function AdminLayout({ tabs, activeTab, onSelectTab, onLogout, children }) {
  // Navigation icons
  const getIcon = (key) => {
    switch (key) {
      case 'artworks': return '🎨';
      case 'exhibitions': return '🏛️';
      case 'cv': return '📄';
      case 'messages': return '✉️';
      case 'settings': return '⚙️';
      default: return '📍';
    }
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-top">
          <div className="admin-brand">
            <span>🎨</span>
            <div>Murat Demirhan</div>
          </div>
        </div>

        <nav className="admin-nav">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`nav-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => onSelectTab(tab.key)}
            >
              <span className="nav-icon">{getIcon(tab.key)}</span>
              {tab.label}
            </button>
          ))}

          <div style={{ flex: 1 }} /> {/* Spacer */}

          <button className="nav-btn" onClick={onLogout}>
            <span className="nav-icon">🚪</span>
            Çıkış
          </button>
        </nav>
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


