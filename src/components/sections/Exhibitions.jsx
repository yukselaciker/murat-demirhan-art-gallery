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
                <div className="timeline">
                    {exhibitions.map((item, index) => {
                        // Skip null items
                        if (!item) return null;

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
                            <div key={id} className="timeline__item fade-in">
                                <div className="timeline__marker"></div>
                                <div className="timeline__date">{year}</div>
                                <div className="timeline__content">
                                    <h3 className="timeline__title">{title}</h3>
                                    {location && <p className="timeline__location">{location}</p>}
                                    {description && <p className="timeline__description">{description}</p>}
                                    {type && <span className="timeline__type">{type}</span>}
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
