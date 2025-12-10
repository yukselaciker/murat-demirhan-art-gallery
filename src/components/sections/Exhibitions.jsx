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

    // Debug log - her zaman çalışır
    console.log('[Exhibitions] Raw data:', exhibitions);
    console.log('[Exhibitions] isLoading:', isLoading);
    console.log('[Exhibitions] exhibitions length:', exhibitions?.length);

    // Güvenli type label fonksiyonu - ASLA crash olmaz
    const getTypeLabel = (type) => {
        try {
            // Null/undefined/empty kontrolü
            if (!type || type === '' || type === null || type === undefined) {
                return null; // Gösterme
            }

            // String değilse string'e çevir
            const typeStr = String(type).trim();

            if (!typeStr) return null;

            // Eğer nokta içeriyorsa, son kısmı al
            if (typeStr.includes('.')) {
                const parts = typeStr.split('.');
                const lastPart = parts[parts.length - 1];
                return lastPart || null;
            }

            // Bilinen İngilizce anahtarları çevir
            const knownTypes = ['solo', 'group', 'fair', 'invited'];
            if (knownTypes.includes(typeStr.toLowerCase())) {
                return t(`exhibitions.types.${typeStr.toLowerCase()}`);
            }

            // Diğer durumlarda olduğu gibi göster
            return typeStr;
        } catch (err) {
            console.error('[Exhibitions] getTypeLabel error:', err);
            return null;
        }
    };

    // Loading durumu
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

    // Boş veri kontrolü
    if (!exhibitions || !Array.isArray(exhibitions) || exhibitions.length === 0) {
        console.log('[Exhibitions] No data or empty array');
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

    // Her item'ı güvenli şekilde render et
    const renderExhibition = (exhibition, index) => {
        try {
            // Null item kontrolü
            if (!exhibition) {
                console.warn('[Exhibitions] Null item at index:', index);
                return null;
            }

            // Güvenli erişim
            const id = exhibition?.id ?? `exhibition-${index}`;
            const year = exhibition?.year ?? '-';
            const title = (language === 'en' && exhibition?.titleEn)
                ? exhibition.titleEn
                : (exhibition?.title ?? 'İsimsiz Sergi');
            const venue = exhibition?.venue ?? '';
            const city = exhibition?.city ?? '';
            const location = venue && city ? `${venue}, ${city}` : (venue || city || 'Konum belirtilmedi');
            const description = (language === 'en' && exhibition?.descriptionEn)
                ? exhibition.descriptionEn
                : exhibition?.description;
            const typeLabel = getTypeLabel(exhibition?.type);

            return (
                <div key={id} className="timeline__item fade-in">
                    <div className="timeline__marker"></div>
                    <div className="timeline__date">{year}</div>
                    <div className="timeline__content">
                        <h3 className="timeline__title">{title}</h3>
                        <p className="timeline__location">{location}</p>
                        {description && <p className="timeline__description">{description}</p>}
                        {typeLabel && <span className="timeline__type">{typeLabel}</span>}
                    </div>
                </div>
            );
        } catch (err) {
            console.error('[Exhibitions] Error rendering item:', index, exhibition, err);
            return null;
        }
    };

    return (
        <section className="exhibitions" id="sergiler">
            <div className="container">
                <div className="exhibitions__header fade-in">
                    <h2 className="section-title section-title--center">{t('exhibitions.title')}</h2>
                    <p>{t('exhibitions.subtitle')}</p>
                </div>
                <div className="timeline">
                    {exhibitions.map((exhibition, index) => renderExhibition(exhibition, index))}
                </div>
            </div>
        </section>
    );
}

export default Exhibitions;
