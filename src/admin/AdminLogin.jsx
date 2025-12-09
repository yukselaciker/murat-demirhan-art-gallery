import { useState } from 'react';

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = onLogin(username, password);
    if (err) setError(err);
  };

  return (
    <div className="admin-page">
      <div className="admin-card">
        <h1>Admin Panel</h1>
        <p className="muted">Giriş yaparak yönetim paneline erişin</p>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Kullanıcı Adı
            <input value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>
          <label>
            Şifre
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifrenizi girin"
              required
            />
          </label>
          {error && <div className="alert alert-error">{error}</div>}
          <button type="submit" className="btn primary">
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}


