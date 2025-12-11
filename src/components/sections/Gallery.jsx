// ============================================
// GALLERY SECTION - MURAT DEMİRHAN PORTFOLYO
// Eserler galerisi - filtreleme, arama ve lightbox
// ============================================

import { useState, useMemo, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import LightboxModal from '../gallery/LightboxModal';
import ProtectedImage from '../ui/ProtectedImage';
import './Gallery.css';

export function Gallery() {
    const { t, language } = useLanguage();
    const { artworks } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [lightboxIndex, setLightboxIndex] = useState(null);
    const gridRef = useRef(null);

    // Arama filtresi
    const filteredArtworks = useMemo(() => {
        if (!Array.isArray(artworks)) {
            console.warn('Galeri verisi boş geldi!');
            return [];
        }
        return artworks.filter(artwork => {
            // Sadece arama filtresi
            const searchLower = searchTerm.toLowerCase();
            const title = language === 'en' && artwork.titleEn ? artwork.titleEn : artwork.title;
            const tags = language === 'en' && artwork.tagsEn ? artwork.tagsEn : artwork.tags;

            const matchesSearch = searchTerm === '' ||
                (title && title.toLowerCase().includes(searchLower)) ||
                (tags && tags.some(tag => tag.toLowerCase().includes(searchLower)));

            return matchesSearch;
        });
    }, [searchTerm, language, artworks]);

    // Scroll animasyonu
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (gridRef.current) {
            const cards = gridRef.current.querySelectorAll('.artwork-card');
            cards.forEach(card => observer.observe(card));
        }

        return () => observer.disconnect();
    }, [filteredArtworks]);



    const getStatusLabel = (status) => {
        if (!status) return ''; // Status yoksa boş döndür
        const statusKey = `gallery.status.${status}`;
        return t(statusKey);
    };

    const openLightbox = (index) => {
        setLightboxIndex(index);
    };

    const closeLightbox = () => {
        setLightboxIndex(null);
    };

    const goToPrevious = () => {
        if (lightboxIndex > 0) {
            setLightboxIndex(lightboxIndex - 1);
        }
    };

    const goToNext = () => {
        if (lightboxIndex < filteredArtworks.length - 1) {
            setLightboxIndex(lightboxIndex + 1);
        }
    };

    return (
        <section className="gallery" id="galeri">
            <div className="container">
                {/* Başlık */}
                <div className="gallery__header fade-in">
                    <h2 className="section-title section-title--center">{t('gallery.title')}</h2>
                    <p>{t('gallery.subtitle')}</p>
                </div>

                {/* Arama */}
                <div className="gallery__controls fade-in">
                    <div className="gallery__search">
                        <svg className="gallery__search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            className="gallery__search-input"
                            placeholder={t('gallery.searchPlaceholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            aria-label={t('gallery.searchPlaceholder')}
                        />
                    </div>
                </div>

                {/* Galeri Grid */}
                <div className="gallery__grid stagger visible" ref={gridRef}>
                    {filteredArtworks.length === 0 ? (
                        <div className="gallery__no-results">
                            <p>{t('gallery.noResults')}</p>
                        </div>
                    ) : (
                        filteredArtworks.map((artwork, index) => {
                            const title = language === 'en' && artwork.titleEn ? artwork.titleEn : artwork.title;
                            const technique = language === 'en' && artwork.techniqueEn ? artwork.techniqueEn : artwork.technique;

                            return (
                                <article
                                    key={artwork.id}
                                    className="artwork-card"
                                    onClick={() => openLightbox(index)}
                                    tabIndex={0}
                                    role="button"
                                    aria-label={`${title} - ${t('gallery.viewDetails')}`}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            openLightbox(index);
                                        }
                                    }}
                                >
                                    <div className="artwork-card__image-wrapper">
                                        {artwork.image ? (
                                            <ProtectedImage
                                                src={(() => {
                                                    const raw = artwork.thumbnail || artwork.image;
                                                    if (!raw) return '';
                                                    if (raw.startsWith('data:')) return raw;

                                                    let fullUrl = raw;
                                                    if (!raw.startsWith('http')) {
                                                        const baseUrl = import.meta.env.VITE_SUPABASE_URL
                                                            ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/artworks/`
                                                            : '';
                                                        if (baseUrl) {
                                                            fullUrl = `${baseUrl.replace(/\/$/, '')}/${raw.replace(/^\//, '')}`;
                                                        }
                                                    }

                                                    return `https://wsrv.nl/?url=${encodeURIComponent(fullUrl)}&w=800&q=75&fit=cover&output=jpg`;
                                                })()}
                                                alt={`${title} - ${technique}`}
                                                artworkTitle={title}
                                                className="artwork-card__image"
                                                loading="eager"
                                                referrerPolicy="no-referrer"
                                            />
                                        ) : (
                                            <div className="placeholder-image">
                                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>{title}</span>
                                            </div>
                                        )}
                                        <div className="artwork-card__overlay">
                                            <span className="artwork-card__view-text">{t('gallery.viewDetails')}</span>
                                        </div>
                                    </div>
                                    <div className="artwork-card__info">
                                        <h3 className="artwork-card__title">{title}</h3>
                                        <p className="artwork-card__details">{artwork.year} • {technique}</p>
                                        <p className="artwork-card__details">{artwork.size}</p>
                                        <span className="artwork-card__status">{getStatusLabel(artwork.status)}</span>
                                    </div>
                                </article>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Lightbox Modal */}
            {lightboxIndex !== null && (
                <LightboxModal
                    artwork={filteredArtworks[lightboxIndex]}
                    onClose={closeLightbox}
                    onPrevious={goToPrevious}
                    onNext={goToNext}
                    hasPrevious={lightboxIndex > 0}
                    hasNext={lightboxIndex < filteredArtworks.length - 1}
                />
            )}
        </section>
    );
}

export default Gallery;
