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

                {/* Genel Bilgiler */}
                <section>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Genel Bilgiler</h3>
                    <Card>
                        <FormGrid columns={2}>
                            <Input
                                label="Site Başlığı"
                                value={formData.siteName}
                                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                            />
                            <Input
                                label="E-posta Adresi"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            <Input
                                label="Instagram URL"
                                value={formData.instagram}
                                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                            />
                            <Input
                                label="Telefon"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                            <Input
                                label="Konum / Adres"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                fullWidth
                                style={{ gridColumn: '1 / -1' }}
                            />
                        </FormGrid>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                            <Button onClick={handleSave} isLoading={isSaving}>Değişiklikleri Kaydet</Button>
                        </div>
                    </Card>
                </section>

                {/* Güvenlik */}
                <section>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Güvenlik</h3>
                    <Card>
                        <FormGrid columns={3}>
                            <Input
                                label="Mevcut Şifre"
                                type="password"
                                value={passwordData.current}
                                onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                            />
                            <Input
                                label="Yeni Şifre"
                                type="password"
                                value={passwordData.new}
                                onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                            />
                            <Input
                                label="Yeni Şifre (Tekrar)"
                                type="password"
                                value={passwordData.confirm}
                                onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                            />
                        </FormGrid>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                            <Button variant="secondary" onClick={handlePasswordReset}>Şifreyi Güncelle</Button>
                        </div>
                    </Card>
                </section>

                {/* Tehlikeli Bölge */}
                <section>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', color: 'var(--color-danger)' }}>Tehlikeli Bölge</h3>
                    <DangerZone
                        title="Sistemi Sıfırla"
                        description="Bu işlem tüm veritabanını temizler ve varsayılan ayarlara döndürür. Bu işlem geri alınamaz."
                        actionText="Sistemi Sıfırla"
                        onAction={() => confirm('Emin misiniz?')}
                    />
                </section>

            </div>
        </div>
    );
}
