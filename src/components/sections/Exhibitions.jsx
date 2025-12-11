// ============================================
// EXHIBITIONS SECTION - MURAT DEMİRHAN PORTFOLYO
// Sergiler timeline bölümü
// ============================================

import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import './Exhibitions.css';

// Safe type formatter
const formatType = (typeString) => {
    if (!typeString) return null;
    if (typeof typeString !== 'string') return String(typeString);
    return typeString.replace('exhibitions.types.', '');
};

export function Exhibitions() {
    const { t } = useLanguage();
    const publicData = useData();
    const exhibitions = publicData?.exhibitions || [];
    const isLoading = publicData?.isLoading ?? true;

    // Loading state
    if (isLoading) {
        return (
            <section className="exhibitions" id="sergiler">
                <div className="container">
                    <div className="exhibitions__header">
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
                    <div className="exhibitions__header">
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

    // Render exhibitions
    return (
        <section className="exhibitions" id="sergiler">
            <div className="container">
                <div className="exhibitions__header">
                    <h2 className="section-title section-title--center">{t('exhibitions.title')}</h2>
                    <p>{t('exhibitions.subtitle')}</p>
                </div>
                <div className="timeline">
                    {exhibitions.map((item, index) => {
                        if (!item) return null;

                        const id = item.id || `ex-${index}`;
                        const title = item.title || 'İsimsiz Sergi';
                        const year = item.year || '';
                        const venue = item.venue || '';
                        const city = item.city || '';
                        const description = item.description || '';
                        const type = formatType(item.type);
                        const location = venue && city ? `${venue}, ${city}` : (venue || city || '');

                        return (
                            <div key={id} className="timeline__item">
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
