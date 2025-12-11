import { useState, useEffect } from 'react';
import { useSiteData } from '../data/siteData.js';

export default function SettingsPanel() {
    const { data, updateContactInfo, resetData, isInitialized } = useSiteData();

    // Safe access with fallbacks
    const contactInfo = data?.contactInfo || {};
    const [email, setEmail] = useState(contactInfo.email || '');
    const [location, setLocation] = useState(contactInfo.location || '');
    const [phone, setPhone] = useState(contactInfo.phone || '');
    const [message, setMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Update form when data loads
    useEffect(() => {
        if (data?.contactInfo) {
            setEmail(data.contactInfo.email || '');
            setLocation(data.contactInfo.location || '');
            setPhone(data.contactInfo.phone || '');
        }
    }, [data?.contactInfo]);

    const handleSave = async () => {
        setIsSaving(true);
        setMessage('');
        try {
            await updateContactInfo({ email, location, phone });
            setMessage('success:İletişim bilgileri güncellendi.');
            setTimeout(() => setMessage(''), 3000);
        } catch (e) {
            console.error(e);
            setMessage('error:Kaydetme hatası.');
        } finally {
            setIsSaving(false);
        }
    };

    const messageType = message.split(':')[0];
    const messageText = message.split(':').slice(1).join(':');

    if (!isInitialized) {
        return (
            <div className="artworks-panel">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Ayarlar yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="artworks-panel">
            <div className="panel-header-modern">
                <div>
                    <h2>⚙️ Ayarlar</h2>
                    <p className="subtitle">Site genel ayarları ve iletişim bilgileri.</p>
                </div>
                <button className="btn-add-new" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </button>
            </div>

            {message && (
                <div className={`toast ${messageType}`}>
                    {messageType === 'success' ? '✅' : '❌'} {messageText}
                </div>
            )}

            <div className="panel" style={{ gap: '2rem' }}>
                {/* Contact Info Card */}
                <div className="form-card">
                    <h3>İletişim Bilgileri</h3>
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
                        <button className="btn-primary" onClick={handleSave} disabled={isSaving} style={{ width: '100%', padding: '1rem' }}>
                            {isSaving ? 'Kaydediliyor...' : 'Bilgileri Güncelle'}
                        </button>
                    </div>
                </div>

                {/* Danger Zone Card */}
                <div className="form-card" style={{ borderColor: 'var(--danger-200)', backgroundColor: '#fff5f5' }}>
                    <h3 style={{ color: 'var(--danger-600)' }}>⚠️ Tehlikeli Bölge</h3>
                    <p style={{ color: 'var(--slate-600)', marginBottom: '1.5rem' }}>
                        Bu işlem veritabanındaki tüm verileri (eserler, sergiler, ayarlar) silerek başlangıç varsayılanlarına döndürür.
                        Bu işlem <strong>geri alınamaz</strong>.
                    </p>
                    <button className="btn danger" onClick={() => {
                        if (confirm('TÜM VERİLER SİLİNECEK! Emin misiniz?')) resetData();
                    }}>
                        Verileri Sıfırla (Factory Reset)
                    </button>
                </div>
            </div>
        </div>
    );
}
