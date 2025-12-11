import { useState, useRef, useEffect } from 'react';
import { uploadToR2, isR2Configured } from '../lib/r2Config.js';
import './ImageUploader.css';

/**
 * ImageUploader Component
 * Uploads images DIRECTLY to Cloudflare R2
 * NO base64 fallback - R2 must be configured!
 */
export default function ImageUploader({ value, onChange, label = "Görsel Yükle", folder = "artworks" }) {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState(value || null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const fileInputRef = useRef(null);

    // SYNC: When parent value changes (e.g., form reset), update preview
    useEffect(() => {
        setPreview(value || null);
        setUploadSuccess(false);
        setUploadError(null);
        // Also clear the file input when value is reset
        if (!value && fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [value]);

    const handleFile = async (file) => {
        // Reset states
        setUploadError(null);
        setUploadSuccess(false);

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setUploadError('Lütfen sadece resim dosyası yükleyin (JPG, PNG, WebP)');
            return;
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            setUploadError('Dosya boyutu çok büyük. Maksimum 10MB olmalıdır.');
            return;
        }

        // Show preview immediately using blob URL (NOT base64!)
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);

        // Check if R2 is configured
        const r2Ready = isR2Configured();
        console.log('[ImageUploader] R2 configured:', r2Ready);

        if (!r2Ready) {
            setUploadError('❌ R2 yapılandırılmamış! .env.local dosyasını kontrol edin.');
            console.error('[ImageUploader] R2 NOT configured! Check VITE_R2_* env vars');
            // DO NOT fall back to base64 - just show error
            return;
        }

        // Upload to Cloudflare R2
        setIsUploading(true);
        try {
            console.log('[ImageUploader] Starting R2 upload...');
            const r2Url = await uploadToR2(file, folder);
            console.log('[ImageUploader] ✅ R2 upload successful:', r2Url);

            // Update preview and call onChange with the R2 URL
            setPreview(r2Url);
            onChange(r2Url);
            setUploadSuccess(true);

        } catch (error) {
            console.error('[ImageUploader] ❌ R2 upload failed:', error);
            setUploadError(`Yükleme hatası: ${error.message}`);
            // Clear the preview since upload failed
            setPreview(null);
            onChange('');
        } finally {
            setIsUploading(false);
        }
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
        setUploadSuccess(false);
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="image-uploader">
            <label className="upload-label">{label}</label>

            {uploadError && (
                <div className="upload-error" style={{
                    color: '#ef4444',
                    fontSize: '0.875rem',
                    marginBottom: '0.5rem',
                    padding: '0.5rem',
                    background: '#fef2f2',
                    borderRadius: '4px'
                }}>
                    ⚠️ {uploadError}
                </div>
            )}

            {uploadSuccess && (
                <div style={{
                    color: '#10b981',
                    fontSize: '0.875rem',
                    marginBottom: '0.5rem',
                    padding: '0.5rem',
                    background: '#ecfdf5',
                    borderRadius: '4px'
                }}>
                    ✅ Görsel R2'ye yüklendi!
                </div>
            )}

            {preview ? (
                <div className="upload-preview" style={{ position: 'relative' }}>
                    <img src={preview} alt="Preview" />
                    {isUploading && (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            borderRadius: '8px',
                            fontSize: '1rem'
                        }}>
                            ⏳ R2'ye yükleniyor...
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
                        JPG, PNG, WebP • Maks. 10MB • ☁️ Cloudflare R2
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
