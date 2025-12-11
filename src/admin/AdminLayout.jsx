export default function AdminLayout({ tabs, activeTab, onSelectTab, onLogout, children }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span>🎨</span>
          <strong>Murat Demirhan</strong>
        </div>
        <div className="mobile-nav-indicator">
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1H19M1 7H19M1 13H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>Kaydır</span>
        </div>
        <nav className="admin-nav">
          {tabs.map((tab) => (
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

