// ============================================
// EXHIBITIONS SECTION - MURAT DEMİRHAN PORTFOLYO
// Sergiler timeline bölümü
// ============================================

import { useLanguage } from '../../context/LanguageContext';
import { usePublicData } from '../../data/siteData';
import './Exhibitions.css';

export function Exhibitions() {
    const { t, language } = useLanguage();
    const { exhibitions } = usePublicData();

    const getTypeLabel = (type) => {
        // Eğer type zaten Türkçe metin ise (veritabanından), direkt göster
        // Çeviri anahtarı formatındaysa çevirmeyi dene
        const knownTypes = ['solo', 'group', 'fair', 'invited'];

        if (knownTypes.includes(type)) {
            const typeKey = `exhibitions.types.${type}`;
            return t(typeKey);
        }

        // Veritabanından gelen Türkçe metin ise direkt göster
        return type;
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
