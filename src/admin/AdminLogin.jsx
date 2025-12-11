import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Button } from '../components/admin/ui/Button';
import { Input } from '../components/admin/ui/Input';
import { Card } from '../components/admin/ui/Card';
import { Alert } from '../components/admin/ui/Alert';

export default function AdminLogin() {
  const { login } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Mock Authentication
    // In a real app, this would call Supabase auth
    setTimeout(() => {
      if (email === 'admin@muratdemirhan.com' && password === 'admin123') {
        login({ email });
      } else {
        setError('Geçersiz e-posta veya şifre.');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: 'var(--bg-canvas)',
      padding: '1rem'
    }}>
      <Card className="login-card" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <div style={{
            width: '64px', height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem',
            margin: '0 auto 1rem auto'
          }}>
            🎨
          </div>
          <h2 style={{ margin: '0 0 0.5rem 0', fontWeight: 700 }}>Admin Girişi</h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Devam etmek için giriş yapın</p>
        </div>

        {error && <Alert variant="danger" title="Hata" className="mb-4">{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Input
            label="E-posta"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@muratdemirhan.com"
            required
            fullWidth
            className="mb-4"
          />
          <Input
            label="Şifre"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            fullWidth
            style={{ marginBottom: '1.5rem' }}
          />
          <Button
            type="submit"
            fullWidth
            size="lg"
            isLoading={isLoading}
          >
            Giriş Yap
          </Button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <p>Demo Giriş: admin@muratdemirhan.com / admin123</p>
        </div>
      </Card>
    </div>
  );
}
