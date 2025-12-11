import { useState, useEffect } from 'react';
import { useSiteData } from '../data/siteData.js';

export default function SettingsPanel() {
    const { data, updateContactInfo, resetData, isInitialized } = useSiteData();

    // Debug: Log what data we receive
    useEffect(() => {
        console.log('[SettingsPanel] Data received:', data);
        console.log('[SettingsPanel] ContactInfo:', data?.contactInfo);
        console.log('[SettingsPanel] isInitialized:', isInitialized);
    }, [data, isInitialized]);

    // Safe access with fallbacks
    const contactInfo = data?.contactInfo || {};
    const [email, setEmail] = useState(contactInfo.email || '');
    const [location, setLocation] = useState(contactInfo.location || '');
    const [phone, setPhone] = useState(contactInfo.phone || '');
    const [message, setMessage] = useState('');

    // Update form when data loads
    useEffect(() => {
        if (data?.contactInfo) {
            setEmail(data.contactInfo.email || '');
            setLocation(data.contactInfo.location || '');
            setPhone(data.contactInfo.phone || '');
        }
    }, [data?.contactInfo]);

    // Loading state
    if (!isInitialized) {
        return (
            <div className="panel">
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>Ayarlar yükleniyor...</p>
                </div>
            </div>
        );
    }

    const handleSave = () => {
        updateContactInfo({ email, location, phone });
        setMessage('İletişim bilgileri güncellendi.');
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="panel">
            <div className="panel-header">
                <div>
                    <h2>Ayarlar / İlet işim Bilgileri</h2>
                    <p className="muted">Site üzerinde görünen iletişim bilgilerini buradan düzenleyin.</p>
                </div>
                {message && <div className="alert alert-success">{message}</div>}
            </div>

            <div className="stack">
                <label className="full">
                    E-posta Adresi
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="info@muratdemirhan.com"
                    />
                    <small className="muted">İletişim sayfasında görünecek e-posta adresi</small>
                </label>

                <label className="full">
                    Konum / Şehir
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="İstanbul, Türkiye"
                    />
                    <small className="muted">İletişim sayfasında görünecek konum bilgisi</small>
                </label>

                <label className="full">
                    Telefon (Opsiyonel)
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+90 5XX XXX XX XX"
                    />
                    <small className="muted">Boş bırakılırsa görünmez</small>
                </label>

                <div className="form-actions">
                    <button className="btn primary" onClick={handleSave}>
                        Kaydet
                    </button>
                </div>

                <div className="spacer" style={{ height: '2rem' }}></div>

                <div className="alert alert-error">
                    <strong>Tehlikeli Bölge</strong>
                    <p className="tiny" style={{ margin: '0.5rem 0' }}>
                        Tüm verileri silip varsayılan başlangıç verilerine döndürür. Bu işlem geri alınamaz.
                    </p>
                    <button className="btn danger tiny" onClick={resetData}>
                        Verileri Sıfırla
                    </button>
                </div>
            </div>
        </div>
    );
}
