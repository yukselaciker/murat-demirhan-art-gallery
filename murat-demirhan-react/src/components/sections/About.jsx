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
                        {cv?.artistPhoto ? (
                            <img src={cv.artistPhoto} alt="Murat Demirhan" />
                        ) : (
                            <div className="placeholder-image placeholder-image--portrait">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>Sanatçı Portresi</span>
                            </div>
                        )}
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
                                    {cv.education && cv.education.length > 0 ? (
                                        <ul className="about__info-list">
                                            {cv.education.map((e, idx) => (
                                                <li key={idx}>{e.school} ({e.year})</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="about__info-value">-</p>
                                    )}
                                </div>
                                <div className="about__info-item">
                                    <p className="about__info-label">Ödüller</p>
                                    {cv.awards && cv.awards.length > 0 ? (
                                        <ul className="about__info-list">
                                            {cv.awards.map((a, idx) => (
                                                <li key={idx}>{a.title} - {a.org} ({a.year})</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="about__info-value">-</p>
                                    )}
                                </div>
                                <div className="about__info-item">
                                    <p className="about__info-label">Öne Çıkanlar</p>
                                    {cv.highlights && cv.highlights.length > 0 ? (
                                        <ul className="about__info-list">
                                            {cv.highlights.map((h, idx) => (
                                                <li key={idx}>{h}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="about__info-value">Güncel başarılar yakında</p>
                                    )}
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
