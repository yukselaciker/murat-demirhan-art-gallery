import { useState } from 'react';

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = onLogin(username, password);
    setError(err || '');
  };

  return (
    <div className="login-shell">
      <div className="login-illustration">
        <div className="illustration-overlay">
          <div className="brand-mark-lg">MD</div>
          <div>
            <p className="eyebrow">Sanat Yönetimi</p>
            <h2>Modern estetik, güçlü kontrol.</h2>
            <p className="muted">Sanat galerisi içeriğinizi premium bir deneyimle yönetin.</p>
          </div>
        </div>
      </div>

      <div className="login-panel">
        <div className="login-card">
          <div className="section-header">
            <p className="eyebrow">Yönetim Paneli</p>
            <h1>Welcome Back</h1>
            <p className="muted">Hesabınıza giriş yaparak kontrol paneline ulaşın.</p>
          </div>

          <form className="stacked-form" onSubmit={handleSubmit}>
            <div className={`input-field ${error ? 'has-error' : ''}`}>
              <label htmlFor="username">Kullanıcı Adı</label>
              <div className="input-shell">
                <span className="input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12Z" />
                    <path d="M5.25 19.5a6.75 6.75 0 0 1 13.5 0" />
                  </svg>
                </span>
                <input
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className={`input-field ${error ? 'has-error' : ''}`}>
              <label htmlFor="password">Şifre</label>
              <div className="input-shell">
                <span className="input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M7 10V8a5 5 0 0 1 10 0v2" />
                    <rect x="5" y="10" width="14" height="10" rx="2" />
                  </svg>
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifrenizi girin"
                  autoComplete="current-password"
                  required
                />
              </div>
              {error && <p className="input-error">{error}</p>}
            </div>

            <button type="submit" className="btn-primary solid btn-full">
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


