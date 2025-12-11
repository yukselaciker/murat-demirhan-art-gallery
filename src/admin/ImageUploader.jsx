import { useState, useRef } from 'react';
import { uploadToR2, isR2Configured } from '../lib/r2Config.js';
import './ImageUploader.css';

/**
 * ImageUploader Component
 * Uploads images to Cloudflare R2 (or falls back to base64)
 * Shows preview and upload progress
 */
export default function ImageUploader({ value, onChange, label = "Görsel Yükle", folder = "artworks" }) {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState(value || null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFile = async (file) => {
        // Reset error state
        setUploadError(null);

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setUploadError('Lütfen sadece resim dosyası yükleyin (JPG, PNG, WebP)');
            return;
        }

        // Validate file size (max 10MB for R2)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
            setUploadError('Dosya boyutu çok büyük. Maksimum 10MB olmalıdır.');
            return;
        }

        // Show preview immediately from file
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);

        // Check if R2 is configured
        if (isR2Configured()) {
            // Upload to Cloudflare R2
            setIsUploading(true);
            try {
                const r2Url = await uploadToR2(file, folder);
                console.log('[ImageUploader] R2 upload successful:', r2Url);
                setPreview(r2Url);
                onChange(r2Url);
            } catch (error) {
                console.error('[ImageUploader] R2 upload failed:', error);
                setUploadError('Yükleme başarısız. Tekrar deneyin.');
                // Fall back to base64 if R2 fails
                fallbackToBase64(file);
            } finally {
                setIsUploading(false);
            }
        } else {
            // R2 not configured, use base64 (legacy fallback)
            console.log('[ImageUploader] R2 not configured, using base64');
            fallbackToBase64(file);
        }
    };

    const fallbackToBase64 = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            setPreview(dataUrl);
            onChange(dataUrl);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleFile(files[0]);
        }
    };

    const handleFileSelect = (e) => {
        const files = e.target.files;
        if (files && files[0]) {
            handleFile(files[0]);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        setUploadError(null);
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="image-uploader">
            <label className="upload-label">{label}</label>

            {uploadError && (
                <div className="upload-error" style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    ⚠️ {uploadError}
                </div>
            )}

            {preview ? (
                <div className="upload-preview">
                    <img src={preview} alt="Preview" />
                    {isUploading && (
                        <div className="upload-overlay" style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            borderRadius: '8px'
                        }}>
                            Yükleniyor...
                        </div>
                    )}
                    <div className="preview-actions">
                        <button
                            type="button"
                            className="btn tiny ghost"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                        >
                            Değiştir
                        </button>
                        <button
                            type="button"
                            className="btn tiny danger"
                            onClick={handleRemove}
                            disabled={isUploading}
                        >
                            Kaldır
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <svg
                        className="upload-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                    </svg>
                    <p className="upload-text-primary">
                        Resim dosyasını sürükleyip bırakın
                    </p>
                    <p className="upload-text-secondary">
                        veya tıklayarak dosya seçin
                    </p>
                    <p className="upload-hint">
                        JPG, PNG, WebP • Maks. 10MB • Cloudflare R2
                    </p>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />
        </div>
    );
}
