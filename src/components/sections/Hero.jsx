// ============================================
// HERO SECTION - MURAT DEMİRHAN PORTFOLYO
// Ana sayfa üst kısmı
// ============================================

import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import Button from '../ui/Button';
import ProtectedImage from '../ui/ProtectedImage';
import './Hero.css';

export function Hero() {
    const { t } = useLanguage();
    const siteData = useData();

    // Find featured artwork
    const featuredArtwork = siteData.artworks.find(art => art.id === siteData.featuredArtworkId);

    const handleScroll = (e, sectionId) => {
        e.preventDefault();
        const element = document.getElementById(sectionId);
        if (element) {
            const headerHeight = 80;
            const targetPosition = element.offsetTop - headerHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="hero" id="hero">
            <div className="container">
                <div className="hero__content">
                    {/* Sol Taraf: Metin ve Butonlar */}
                    <div className="hero__text">
                        <p className="hero__subtitle fade-in">{t('hero.subtitle')}</p>
                        <h1 className="hero__title fade-in">{t('hero.title')}</h1>
                        <p className="hero__description fade-in">
                            {t('hero.description')}
                        </p>
                        <div className="hero__buttons fade-in">
                            <Button
                                variant="primary"
                                href="#galeri"
                                onClick={(e) => handleScroll(e, 'galeri')}
                                icon={
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                }
                            >
                                {t('hero.cta.primary')}
                            </Button>
                            <Button
                                variant="secondary"
                                href="#hakkinda"
                                onClick={(e) => handleScroll(e, 'hakkinda')}
                            >
                                {t('hero.cta.secondary')}
                            </Button>
                        </div>
                    </div>

                    {/* Sağ Taraf: Öne Çıkan Eser */}
                    <div className="hero__image-wrapper fade-in">
                        <div className="hero__image-frame">
                            {featuredArtwork && featuredArtwork.image ? (
                                <>
                                    <ProtectedImage
                                        src={featuredArtwork.image}
                                        alt={featuredArtwork.title}
                                        className="hero__featured-image"
                                    />
                                    <div className="hero__artwork-info">
                                        <h3>{featuredArtwork.title}</h3>
                                        <p>{featuredArtwork.year} • {featuredArtwork.technique}</p>
                                    </div>
                                </>
                            ) : (
                                <div className="placeholder-image">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>Öne Çıkan Eser</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Dekoratif Arka Plan */}
            <div className="hero__decoration" aria-hidden="true"></div>
        </section>
    );
}

export default Hero;
