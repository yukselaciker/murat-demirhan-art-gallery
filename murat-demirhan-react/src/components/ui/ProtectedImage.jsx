// ============================================
// PROTECTED IMAGE - MURAT DEMİRHAN PORTFOLYO
// Canvas tabanlı korumalı görsel component'i
// Görseller doğrudan <img> yerine canvas ile gösterilir
// ============================================

import { useEffect, useRef, useState } from 'react';
import { drawWatermarkedImage } from '../../utils/watermark';
import './ProtectedImage.css';

export function ProtectedImage({
    src,
    alt,
    className = '',
    artworkTitle = '',
    onClick,
    loading = 'lazy'
}) {
    const canvasRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        if (!src || !canvasRef.current) return;

        const loadImage = async () => {
            try {
                setIsLoading(true);
                setHasError(false);

                // Canvas'a filigranlı görsel çiz
                await drawWatermarkedImage(src, canvasRef.current, {
                    artworkTitle,
                    opacity: 0, // Görünmez filigran
                    fontSize: 12,
                    spacing: 150
                });

                setIsLoading(false);
            } catch (error) {
                console.error('Görsel yüklenemedi:', error);
                setHasError(true);
                setIsLoading(false);
            }
        };

        // Lazy loading simülasyonu
        if (loading === 'lazy') {
            const observer = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        loadImage();
                        observer.disconnect();
                    }
                },
                { threshold: 0.1 }
            );

            observer.observe(canvasRef.current);

            return () => observer.disconnect();
        } else {
            loadImage();
        }
    }, [src, artworkTitle, loading]);

    // Sağ tık engelle
    const handleContextMenu = (e) => {
        e.preventDefault();
        return false;
    };

    // Sürükleme engelle
    const handleDragStart = (e) => {
        e.preventDefault();
        return false;
    };

    return (
        <div
            className={`protected-image ${className}`}
            onClick={onClick}
            onContextMenu={handleContextMenu}
            onDragStart={handleDragStart}
        >
            {/* Loading skeleton */}
            {isLoading && (
                <div className="protected-image__skeleton skeleton" />
            )}

            {/* Canvas (korumalı görsel) */}
            <canvas
                ref={canvasRef}
                className={`protected-image__canvas ${isLoading ? 'hidden' : ''}`}
                aria-label={alt}
                role="img"
            />

            {/* Hata durumu - Fallback olarak normal resim göster (Güvenlikten ödün verilir ama görünürlük sağlanır) */}
            {hasError && !isLoading && (
                <img
                    src={src}
                    alt={alt}
                    className="protected-image__canvas"
                    style={{ objectFit: 'cover' }}
                    onContextMenu={(e) => e.preventDefault()}
                />
            )}

            {/* Görünmez koruma katmanı */}
            <div className="protected-image__shield" aria-hidden="true" />
        </div>
    );
}

export default ProtectedImage;
