// ============================================
// EXHIBITIONS SECTION - MURAT DEMİRHAN PORTFOLYO
// Sergiler timeline bölümü
// ============================================

import { useLanguage } from '../../context/LanguageContext';
import { usePublicData } from '../../data/siteData';
import './Exhibitions.css';

// Ultra-safe type formatter - NEVER crashes
const formatType = (typeString) => {
    if (!typeString) return null; // Don't show anything if empty
    if (typeof typeString !== 'string') return String(typeString);
    // Remove prefix if present
    return typeString.replace('exhibitions.types.', '');
};

export function Exhibitions() {
    const { t, language } = useLanguage();
    const publicData = usePublicData();

    // Safe destructuring with defaults
    const exhibitions = publicData?.exhibitions || [];
    const isLoading = publicData?.isLoading ?? true;

    // Debug
    console.log('[Exhibitions] exhibitions:', exhibitions);
    console.log('[Exhibitions] isLoading:', isLoading);
    console.log('[Exhibitions] count:', exhibitions.length);

    // Loading state
    if (isLoading) {
        return (
            <section className="exhibitions" id="sergiler">
                <div className="container">
                    <div className="exhibitions__header fade-in">
                        <h2 className="section-title section-title--center">{t('exhibitions.title')}</h2>
                        <p>{t('exhibitions.subtitle')}</p>
                    </div>
                    <div className="timeline">
                        <div className="timeline__empty">
                            <p>Yükleniyor...</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Empty state
    if (exhibitions.length === 0) {
        return (
            <section className="exhibitions" id="sergiler">
                <div className="container">
                    <div className="exhibitions__header fade-in">
                        <h2 className="section-title section-title--center">{t('exhibitions.title')}</h2>
                        <p>{t('exhibitions.subtitle')}</p>
                    </div>
                    <div className="timeline">
                        <div className="timeline__empty">
                            <p>Henüz sergi bilgisi eklenmemiş.</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Render exhibitions - ultra simple
    return (
        <section className="exhibitions" id="sergiler">
            <div className="container">
                <div className="exhibitions__header fade-in">
                    <h2 className="section-title section-title--center">{t('exhibitions.title')}</h2>
                    <p>{t('exhibitions.subtitle')}</p>
                </div>
                {/* DEBUG BANNER - Bu görünüyorsa render çalışıyor */}
                <div style={{ background: '#10b981', color: 'white', padding: '20px', marginBottom: '20px', borderRadius: '8px', textAlign: 'center' }}>
                    ✅ SERGILER YÜKLENDİ: {exhibitions.length} adet sergi bulundu
                </div>
                <div className="timeline">
                    {exhibitions.map((item, index) => {
                        // Detailed debug log
                        console.log('[Exhibitions] MAP item', index, ':', item);
                        console.log('[Exhibitions] MAP item type:', typeof item);
                        console.log('[Exhibitions] MAP item JSON:', JSON.stringify(item));

                        // Don't skip - show something even if item is bad
                        if (!item) {
                            return (
                                <div key={`null-${index}`} style={{ background: 'red', color: 'white', padding: '20px', margin: '10px 0' }}>
                                    ❌ Item {index} is NULL or UNDEFINED
                                </div>
                            );
                        }

                        // Safe field access with fallbacks
                        const id = item.id || `ex-${index}`;
                        const title = item.title || 'İsimsiz Sergi';
                        const year = item.year || '';
                        const venue = item.venue || '';
                        const city = item.city || '';
                        const description = item.description || '';
                        const type = formatType(item.type);

                        // Build location string safely
                        let location = venue;
                        if (city) {
                            location = venue ? `${venue}, ${city}` : city;
                        }
                        if (!location) location = '';

                        console.log('[Exhibitions] Rendering item:', id, title);

                        return (
                            <div key={id} className="timeline__item fade-in" style={{ background: '#fef3c7', border: '3px solid #f59e0b', padding: '20px', marginBottom: '20px' }}>
                                <div className="timeline__marker"></div>
                                <div className="timeline__date" style={{ color: '#b45309', fontSize: '24px', fontWeight: 'bold' }}>{year || '2024'}</div>
                                <div className="timeline__content" style={{ background: 'white', padding: '15px', borderRadius: '8px' }}>
                                    <h3 className="timeline__title" style={{ color: '#1f2937', marginBottom: '8px' }}>{title}</h3>
                                    {location && <p className="timeline__location" style={{ color: '#6b7280' }}>{location}</p>}
                                    {description && <p className="timeline__description" style={{ color: '#9ca3af' }}>{description}</p>}
                                    {type && <span className="timeline__type" style={{ background: '#dbeafe', color: '#1d4ed8', padding: '4px 8px', borderRadius: '4px' }}>{type}</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default Exhibitions;
