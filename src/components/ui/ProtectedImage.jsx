// ============================================
// PROTECTED IMAGE - MURAT DEMİRHAN PORTFOLYO
// Canvas tabanlı korumalı görsel component'i
// Görseller doğrudan <img> yerine canvas ile gösterilir
// ============================================

import { useEffect, useRef, useState, useCallback } from 'react';
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
    const containerRef = useRef(null);
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

    // ============================================
    // SECURITY HANDLERS
    // ============================================

    // Sağ tık engelle
    const handleContextMenu = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, []);

    // Sürükleme engelle
    const handleDragStart = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, []);

    // Seçim engelle
    const handleSelectStart = useCallback((e) => {
        e.preventDefault();
        return false;
    }, []);

    // Mobil long-press engelle
    const handleTouchStart = useCallback((e) => {
        // Long-press menüsünü engelle
        if (e.touches.length === 1) {
            e.target.style.webkitTouchCallout = 'none';
        }
    }, []);

    const handleTouchEnd = useCallback((e) => {
        // Normal tıklama davranışını koru
        if (onClick && e.changedTouches.length === 1) {
            const touch = e.changedTouches[0];
            const element = document.elementFromPoint(touch.clientX, touch.clientY);
            if (containerRef.current?.contains(element)) {
                onClick(e);
            }
        }
    }, [onClick]);

    // Kopyalama engelle
    const handleCopy = useCallback((e) => {
        e.preventDefault();
        return false;
    }, []);

    return (
        <div
            ref={containerRef}
            className={`protected-image ${className}`}
            onClick={onClick}
            onContextMenu={handleContextMenu}
            onDragStart={handleDragStart}
            onSelectStart={handleSelectStart}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onCopy={handleCopy}
            draggable={false}
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
                onContextMenu={handleContextMenu}
                onDragStart={handleDragStart}
                draggable={false}
            />

            {/* Hata durumu - Fallback olarak normal resim göster */}
            {hasError && !isLoading && (
                <img
                    src={src}
                    alt={alt}
                    className="protected-image__canvas"
                    style={{ objectFit: 'cover' }}
                    referrerPolicy="no-referrer"
                    onContextMenu={handleContextMenu}
                    onDragStart={handleDragStart}
                    draggable={false}
                />
            )}

            {/* Görünmez koruma katmanı - tüm etkileşimleri yakalar */}
            <div
                className="protected-image__shield"
                aria-hidden="true"
                onContextMenu={handleContextMenu}
                onDragStart={handleDragStart}
                onTouchStart={handleTouchStart}
            />
        </div>
    );
}

export default ProtectedImage;

