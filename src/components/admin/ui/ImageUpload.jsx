import React, { useRef, useState } from 'react';
import { Button } from './Button';

export const ImageUpload = ({
    currentImage,
    onImageSelected,
    onImageRemoved,
    label = "Görsel Yükle",
    helperText = "PNG, JPG (Max 5MB)",
    className = ''
}) => {
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(currentImage);

    // Sync external prop changes
    React.useEffect(() => {
        setPreview(currentImage);
    }, [currentImage]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create local preview
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            onImageSelected(file);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        onImageRemoved();
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    };

    const dropzoneStyle = {
        border: '2px dashed var(--color-neutral-300)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: 'var(--bg-surface)',
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    };

    const previewStyle = {
        width: '100%',
        height: '100%',
        position: 'absolute',
        inset: 0,
        objectFit: 'cover',
    };

    return (
        <div style={containerStyle} className={className}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>{label}</label>

            <div
                style={dropzoneStyle}
                onClick={() => !preview && fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
            >
                {preview ? (
                    <>
                        <img src={preview} alt="Preview" style={previewStyle} />
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.2s',
                            className: 'hover-overlay' /* Need to use onMouseEnter if we want inline hover, but CSS is better */
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                        >
                            <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); handleRemove(); }}>
                                Görseli Kaldır
                            </Button>
                        </div>
                    </>
                ) : (
                    <div style={{ color: 'var(--text-secondary)' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📷</div>
                        <div style={{ fontWeight: 500 }}>Tıklayın veya sürükleyin</div>
                        <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{helperText}</div>
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                />
            </div>
        </div>
    );
};
