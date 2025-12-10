// ============================================
// ABOUT SECTION - MURAT DEMİRHAN PORTFOLYO
// Sanatçı biyografisi bölümü
// ============================================

import { useLanguage } from '../../context/LanguageContext';
import { usePublicData } from '../../data/siteData';
import ProtectedImage from '../ui/ProtectedImage';
import './About.css';

// Skeleton Loader Component
function SkeletonText({ lines = 3, className = '' }) {
    return (
        <div className={`skeleton-text ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className="skeleton"
                    style={{
                        height: '1em',
                        marginBottom: '0.75em',
                        width: i === lines - 1 ? '70%' : '100%'
                    }}
                />
            ))}
        </div>
    );
}

function SkeletonImage() {
    return (
        <div className="skeleton" style={{ width: '100%', height: '400px', borderRadius: 'var(--radius-lg)' }} />
    );
}

export function About() {
    const { t } = useLanguage();
    const { cv, isLoading } = usePublicData();

    // Sadece API'den gelen biyografi göster, fallback yok
    const bioParagraphs = cv?.bio ? [cv.bio] : [];
    const hasData = cv?.bio || (cv?.education?.length > 0) || (cv?.awards?.length > 0);

    return (
        <section className="about" id="hakkinda">
            <div className="container">
                <div className="about__content">
                    {/* Sol Taraf: Portre */}
                    <div className="about__image-wrapper slide-in-left">
                        {isLoading ? (
                            <SkeletonImage />
                        ) : cv?.artistPhoto ? (
                            <ProtectedImage
                                src={cv.artistPhoto}
                                alt="Murat Demirhan"
                                className="about__artist-photo"
                            />
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

                        {/* Loading State */}
                        {isLoading ? (
                            <SkeletonText lines={5} />
                        ) : bioParagraphs.length > 0 ? (
                            /* Biyografi Paragrafları */
                            bioParagraphs.map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))
                        ) : (
                            /* Veri yoksa boş bırak */
                            <p className="about__placeholder">Biyografi bilgisi yükleniyor...</p>
                        )}

                        {/* Sanatçı Notu - sadece veri yüklendiyse göster */}
                        {!isLoading && hasData && (
                            <blockquote className="about__quote">
                                {t('about.artistNote')}
                            </blockquote>
                        )}

                        {/* Bilgi Kutuları */}
                        {isLoading ? (
                            <div className="about__info">
                                <div className="about__info-item">
                                    <div className="skeleton" style={{ height: '1em', width: '60px', marginBottom: '0.5em' }} />
                                    <SkeletonText lines={2} />
                                </div>
                                <div className="about__info-item">
                                    <div className="skeleton" style={{ height: '1em', width: '60px', marginBottom: '0.5em' }} />
                                    <SkeletonText lines={2} />
                                </div>
                            </div>
                        ) : cv && (
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
