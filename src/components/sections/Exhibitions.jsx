// ============================================
// EXHIBITIONS SECTION - MURAT DEMİRHAN PORTFOLYO
// Sergiler timeline bölümü
// ============================================

import { useLanguage } from '../../context/LanguageContext';
import { usePublicData } from '../../data/siteData';
import './Exhibitions.css';

export function Exhibitions() {
    const { t, language } = useLanguage();
    const { exhibitions, isLoading } = usePublicData();

    console.log('[Exhibitions] Data:', { exhibitions, isLoading, length: exhibitions?.length });

    const getTypeLabel = (type) => {
        // Null/undefined kontrolü
        if (!type) return null;

        // String değilse string'e çevir
        const typeStr = String(type);

        // Eğer "exhibitions.types." prefix'i varsa, sadece son kısmı al
        if (typeStr.includes('.')) {
            const parts = typeStr.split('.');
            return parts[parts.length - 1]; // Son parçayı döndür
        }

        // Bilinen çeviri anahtarlarını çevir
        const knownTypes = ['solo', 'group', 'fair', 'invited'];
        if (knownTypes.includes(typeStr)) {
            const typeKey = `exhibitions.types.${typeStr}`;
            return t(typeKey);
        }

        // Diğer durumlarda olduğu gibi göster
        return typeStr;
    };

    return (
        <section className="exhibitions" id="sergiler">
            <div className="container">
                {/* Başlık */}
                <div className="exhibitions__header fade-in">
                    <h2 className="section-title section-title--center">{t('exhibitions.title')}</h2>
                    <p>{t('exhibitions.subtitle')}</p>
                </div>

                {/* Timeline */}
                <div className="timeline">
                    {(!exhibitions || exhibitions.length === 0) ? (
                        <div className="timeline__empty">
                            <p>Henüz sergi bilgisi eklenmemiş.</p>
                        </div>
                    ) : (
                        exhibitions.map((exhibition) => {
                            const title = language === 'en' && exhibition.titleEn ? exhibition.titleEn : exhibition.title;
                            const description = language === 'en' && exhibition.descriptionEn ? exhibition.descriptionEn : exhibition.description;

                            return (
                                <div key={exhibition.id} className="timeline__item fade-in">
                                    <div className="timeline__marker"></div>
                                    <div className="timeline__date">{exhibition.year}</div>
                                    <div className="timeline__content">
                                        <h3 className="timeline__title">{title}</h3>
                                        <p className="timeline__location">{exhibition.venue}, {exhibition.city}</p>
                                        {description && <p className="timeline__description">{description}</p>}
                                        {exhibition.type && <span className="timeline__type">{getTypeLabel(exhibition.type)}</span>}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </section>
    );
}

export default Exhibitions;
