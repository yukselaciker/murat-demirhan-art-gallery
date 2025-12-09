import { useState, useRef } from 'react';
import './ImageUploader.css';

/**
 * ImageUploader Component
 * Allows drag-and-drop or click-to-upload image files
 * Converts to base64 data URL for storage
 * Shows preview of uploaded image
 */
export default function ImageUploader({ value, onChange, label = "Görsel Yükle" }) {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState(value || null);
    const fileInputRef = useRef(null);

    const handleFile = (file) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Lütfen sadece resim dosyası yükleyin (JPG, PNG, WebP)');
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            alert('Dosya boyutu çok büyük. Maksimum 5MB olmalıdır.');
            return;
        }

        // Convert to base64
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
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="image-uploader">
            <label className="upload-label">{label}</label>

            {preview ? (
                <div className="upload-preview">
                    <img src={preview} alt="Preview" />
                    <div className="preview-actions">
                        <button
                            type="button"
                            className="btn tiny ghost"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Değiştir
                        </button>
                        <button
                            type="button"
                            className="btn tiny danger"
                            onClick={handleRemove}
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
                        JPG, PNG, WebP • Maks. 5MB
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
