export default function AdminLayout({ tabs, activeTab, onSelectTab, onLogout, children }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span>🎨</span>
          <div>
            <strong>Murat Demirhan</strong>
            <p className="muted tiny">Yönetim Paneli</p>
          </div>
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
        <div className="spacer" />
        <button className="btn ghost" onClick={onLogout}>
          Çıkış Yap
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


