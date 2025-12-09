// ============================================
// ABOUT SECTION - MURAT DEMİRHAN PORTFOLYO
// Sanatçı biyografisi bölümü
// ============================================

import { useLanguage } from '../../context/LanguageContext';
import { usePublicData } from '../../data/siteData';
import './About.css';

export function About() {
    const { t } = useLanguage();
    const { cv } = usePublicData();

    // Biyografi paragraflarını çeviri dosyasından al
    const bioParagraphs = cv?.bio ? [cv.bio] : t('about.bio');

    return (
        <section className="about" id="hakkinda">
            <div className="container">
                <div className="about__content">
                    {/* Sol Taraf: Portre */}
                    <div className="about__image-wrapper slide-in-left">
                        {/* Sanatçı portresi placeholder */}
                        <div className="placeholder-image placeholder-image--portrait">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>Sanatçı Portresi</span>
                        </div>
                    </div>

                    {/* Sağ Taraf: Biyografi Metni */}
                    <div className="about__text slide-in-right">
                        <h2 className="section-title">{t('about.title')}</h2>

                        {/* Biyografi Paragrafları */}
                        {Array.isArray(bioParagraphs) && bioParagraphs.map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}

                        {/* Sanatçı Notu */}
                        <blockquote className="about__quote">
                            {t('about.artistNote')}
                        </blockquote>

                        {/* Bilgi Kutuları (dinamik CV verisi) */}
                        {cv && (
                            <div className="about__info">
                                <div className="about__info-item">
                                    <p className="about__info-label">Eğitim</p>
                                    <p className="about__info-value">
                                        {cv.education?.map((e) => e.school).join(' • ') || '-'}
                                    </p>
                                </div>
                                <div className="about__info-item">
                                    <p className="about__info-label">Ödüller</p>
                                    <p className="about__info-value">
                                        {cv.awards?.map((a) => a.title).join(' • ') || '-'}
                                    </p>
                                </div>
                                <div className="about__info-item">
                                    <p className="about__info-label">Öne Çıkanlar</p>
                                    <p className="about__info-value">
                                        {cv.highlights?.[0] || 'Güncel başarılar yakında'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;
