// ============================================
// LIGHTBOX MODAL - MURAT DEMİRHAN PORTFOLYO
// Eser detay modal'ı
// ============================================

import { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import ProtectedImage from '../ui/ProtectedImage';
import './LightboxModal.css';

export function LightboxModal({
    artwork,
    onClose,
    onPrevious,
    onNext,
    hasPrevious,
    hasNext
}) {
    const { t, language } = useLanguage();
    const modalRef = useFocusTrap(true);

    // Klavye kontrolleri
    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'Escape':
                    onClose();
                    break;
                case 'ArrowLeft':
                    if (hasPrevious) onPrevious();
                    break;
                case 'ArrowRight':
                    if (hasNext) onNext();
                    break;
                default:
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.body.classList.add('no-scroll');

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.classList.remove('no-scroll');
        };
    }, [onClose, onPrevious, onNext, hasPrevious, hasNext]);

    // Çok dilli içerik
    const title = language === 'en' && artwork.titleEn ? artwork.titleEn : artwork.title;
    const technique = language === 'en' && artwork.techniqueEn ? artwork.techniqueEn : artwork.technique;
    const description = language === 'en' && artwork.descriptionEn ? artwork.descriptionEn : artwork.description;

    const getStatusLabel = (status) => {
        const statusKey = `gallery.status.${status}`;
        return t(statusKey);
    };

    return (
        <div
            className="lightbox modal-backdrop active"
            onClick={(e) => e.target === e.currentTarget && onClose()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-title"
        >
            {/* Kapat Butonu */}
            <button
                className="lightbox__close"
                onClick={onClose}
                aria-label={t('lightbox.close')}
            >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Önceki Butonu */}
            <button
                className="lightbox__nav lightbox__nav--prev"
                onClick={onPrevious}
                disabled={!hasPrevious}
                aria-label={t('lightbox.prev')}
            >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Sonraki Butonu */}
            <button
                className="lightbox__nav lightbox__nav--next"
                onClick={onNext}
                disabled={!hasNext}
                aria-label={t('lightbox.next')}
            >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Modal İçeriği */}
            <div className="lightbox__content modal-content" ref={modalRef}>
                {/* Görsel */}
                <div className="lightbox__image-wrapper">
                    {artwork.image ? (
                        <ProtectedImage
                            src={artwork.image}
                            alt={`${title} - ${technique}`}
                            className="lightbox__image"
                            artworkTitle={title}
                        />
                    ) : (
                        <div className="placeholder-image">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{title}</span>
                        </div>
                    )}
                </div>

                {/* Bilgi Paneli */}
                <div className="lightbox__info">
                    <h3 className="lightbox__title" id="lightbox-title">{title}</h3>

                    <div className="lightbox__meta">
                        <div className="lightbox__meta-item">
                            <p className="lightbox__meta-label">{t('lightbox.year')}</p>
                            <p className="lightbox__meta-value">{artwork.year}</p>
                        </div>
                        <div className="lightbox__meta-item">
                            <p className="lightbox__meta-label">{t('lightbox.technique')}</p>
                            <p className="lightbox__meta-value">{technique}</p>
                        </div>
                        <div className="lightbox__meta-item">
                            <p className="lightbox__meta-label">{t('lightbox.size')}</p>
                            <p className="lightbox__meta-value">{artwork.size}</p>
                        </div>
                    </div>

                    <p className="lightbox__description">{description}</p>

                    <p className="lightbox__status">{getStatusLabel(artwork.status)}</p>
                </div>
            </div>
        </div>
    );
}

export default LightboxModal;
