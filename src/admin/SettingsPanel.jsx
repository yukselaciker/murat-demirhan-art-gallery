import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/admin/ui/PageHeader';
import { Card } from '../components/admin/ui/Card';
import { Input } from '../components/admin/ui/Input';
import { Button } from '../components/admin/ui/Button';
import { FormGrid } from '../components/admin/ui/FormGrid';
import { DangerZone } from '../components/admin/ui/DangerZone';
import { useAdmin } from '../context/AdminContext';

export default function SettingsPanel() {
    const { themeMode, toggleTheme } = useAdmin();
    const [formData, setFormData] = useState({
        siteName: 'Murat Demirhan | Official Web Site',
        email: 'contact@muratdemirhan.com',
        instagram: 'https://instagram.com/mood_art_s',
        phone: '+90 555 123 45 67',
        address: 'Nişantaşı, İstanbul',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert('Ayarlar kaydedildi (Demo)');
        }, 800);
    };

    const handlePasswordReset = () => {
        alert('Şifre güncelleme (Demo)');
    };

    return (
        <div className="fade-in">
            <PageHeader
                title="Ayarlar"
                subtitle="Web sitesi genel ayarları ve hesap yönetimi"
                actions={
                    <Button variant="secondary" onClick={toggleTheme}>
                        {themeMode === 'light' ? '🌙 Koyu Mod' : '☀️ Açık Mod'}
                    </Button>
                }
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <div className="panel" style={{ gap: '2rem' }}>
                {/* Contact Info Card */}
                <div className="form-card">
                    <h3>İletişim Bilgileri</h3>
                    <div className="stacked-form">
                        <div className="form-grid-modern">
                            <div className="form-group">
                                <label>E-posta Adresi</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="info@muratdemirhan.com"
                                />
                                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>İletişim sayfasında görünür.</div>
                            </div>

                            <div className="form-group">
                                <label>Konum / Şehir</label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="İstanbul, Türkiye"
                                />
                                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>İletişim sayfasında görünür.</div>
                            </div>

                            <div className="form-group full-width">
                                <label>Telefon (Opsiyonel)</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+90 5XX XXX XX XX"
                                    style={{ maxWidth: '50%' }}
                                />
                                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Boş bırakılırsa sitede görünmez.</div>
                            </div>
                        </div>

                        <div className="form-buttons">
                            <button className="btn-primary btn-full" onClick={handleSave} disabled={isSaving} style={{ padding: '1rem' }}>
                                {isSaving ? 'Kaydediliyor...' : 'Bilgileri Güncelle'}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
