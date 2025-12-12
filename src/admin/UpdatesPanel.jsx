// ============================================
// UPDATES PANEL - Admin Panel for Feed Posts
// Create and manage feed posts
// ============================================

import { useState, useCallback, useRef, useEffect } from 'react';
import { createPost, getUploadUrl, uploadImage, getImageUrl, fetchPosts, deletePost } from '../lib/feedApi';
import './UpdatesPanel.css';

const MAX_IMAGES = 10;
const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

/**
 * Admin panel for creating and managing feed posts
 */
export default function UpdatesPanel() {
    // Form state
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [status, setStatus] = useState('published');

    // Image upload state
    const [images, setImages] = useState([]); // Array of {file, key, preview, uploading, error}
    const [isUploading, setIsUploading] = useState(false);

    // Form submission state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Existing posts (for listing)
    const [posts, setPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(true);

    const fileInputRef = useRef(null);

    // Load existing posts on mount
    useEffect(() => {
        fetchPosts()
            .then(data => {
                setPosts(data);
                setPostsLoading(false);
            })
            .catch(err => {
                console.error('Failed to load posts:', err);
                setPostsLoading(false);
            });
    }, []);

    // Handle file selection
    const handleFileSelect = useCallback(async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Filter valid images
        const validFiles = files.filter(f => VALID_IMAGE_TYPES.includes(f.type));
        if (validFiles.length === 0) {
            setErrorMessage('Sadece resim dosyaları yüklenebilir (JPEG, PNG, WebP, GIF)');
            return;
        }

        // Check max limit
        if (images.length + validFiles.length > MAX_IMAGES) {
            setErrorMessage(`En fazla ${MAX_IMAGES} resim yüklenebilir`);
            return;
        }

        setErrorMessage('');
        setIsUploading(true);

        // Process each file
        for (const file of validFiles) {
            const tempId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            const preview = URL.createObjectURL(file);

            // Add to state immediately with uploading status
            setImages(prev => [...prev, {
                id: tempId,
                file,
                key: null,
                preview,
                uploading: true,
                error: null
            }]);

            try {
                // Get upload URL
                const { key } = await getUploadUrl(file.name, file.type);

                // Upload file
                await uploadImage(file, key);

                // Update state with success
                setImages(prev => prev.map(img =>
                    img.id === tempId
                        ? { ...img, key, uploading: false }
                        : img
                ));
            } catch (err) {
                console.error('Upload failed:', err);
                // Update state with error
                setImages(prev => prev.map(img =>
                    img.id === tempId
                        ? { ...img, uploading: false, error: err.message }
                        : img
                ));
            }
        }

        setIsUploading(false);

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [images.length]);

    // Handle drag and drop
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();

        const files = Array.from(e.dataTransfer?.files || []);
        if (files.length > 0) {
            // Create a synthetic event
            handleFileSelect({ target: { files } });
        }
    }, [handleFileSelect]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    // Remove image
    const removeImage = useCallback((id) => {
        setImages(prev => {
            const img = prev.find(i => i.id === id);
            if (img?.preview) {
                URL.revokeObjectURL(img.preview);
            }
            return prev.filter(i => i.id !== id);
        });
    }, []);

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if any images are still uploading
        if (images.some(img => img.uploading)) {
            setErrorMessage('Lütfen tüm resimlerin yüklenmesini bekleyin');
            return;
        }

        // Get successfully uploaded image keys
        const imageKeys = images
            .filter(img => img.key && !img.error)
            .map(img => img.key);

        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const newPost = await createPost({
                title: title.trim() || null,
                body: body.trim() || null,
                images: imageKeys,
                status
            });

            // Success
            setSuccessMessage('Güncelleme başarıyla yayınlandı!');

            // Reset form
            setTitle('');
            setBody('');
            setStatus('published');
            setImages([]);

            // Add to posts list
            setPosts(prev => [newPost, ...prev]);

            // Clear success message after 5 seconds
            setTimeout(() => setSuccessMessage(''), 5000);

        } catch (err) {
            setErrorMessage(err.message || 'Güncelleme yayınlanamadı');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Check if form is valid
    const hasContent = title.trim() || body.trim() || images.some(img => img.key);
    const canSubmit = hasContent && !isSubmitting && !images.some(img => img.uploading);

    return (
        <div className="updates-panel">
            {/* Create Post Form */}
            <div className="panel-card create-post-form">
                <h2>Yeni Güncelleme</h2>

                <form onSubmit={handleSubmit}>
                    {/* Title */}
                    <div className="form-group">
                        <label htmlFor="post-title">Başlık (opsiyonel)</label>
                        <input
                            id="post-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Güncelleme başlığı..."
                            className="form-input"
                        />
                    </div>

                    {/* Body */}
                    <div className="form-group">
                        <label htmlFor="post-body">İçerik (opsiyonel)</label>
                        <textarea
                            id="post-body"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Güncellemelerinizi buraya yazın..."
                            className="form-textarea"
                            rows={5}
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="form-group">
                        <label>Görseller (max {MAX_IMAGES})</label>

                        <div
                            className="image-drop-zone"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileSelect}
                                style={{ display: 'none' }}
                            />
                            <div className="drop-zone-content">
                                <span className="drop-icon">📷</span>
                                <p>Görselleri sürükleyip bırakın veya tıklayın</p>
                                <span className="drop-hint">JPEG, PNG, WebP, GIF</span>
                            </div>
                        </div>

                        {/* Image Preview Grid */}
                        {images.length > 0 && (
                            <div className="image-preview-grid">
                                {images.map((img) => (
                                    <div key={img.id} className={`image-preview-item ${img.error ? 'error' : ''}`}>
                                        <img src={img.preview} alt="Önizleme" />

                                        {img.uploading && (
                                            <div className="image-uploading">
                                                <div className="spinner"></div>
                                            </div>
                                        )}

                                        {img.error && (
                                            <div className="image-error" title={img.error}>
                                                ⚠️
                                            </div>
                                        )}

                                        {!img.uploading && (
                                            <button
                                                type="button"
                                                className="image-remove-btn"
                                                onClick={() => removeImage(img.id)}
                                                aria-label="Görseli kaldır"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Status */}
                    <div className="form-group">
                        <label>Durum</label>
                        <div className="status-selector">
                            <button
                                type="button"
                                className={`status-btn ${status === 'published' ? 'active' : ''}`}
                                onClick={() => setStatus('published')}
                            >
                                <span className="status-dot published"></span>
                                Yayınla
                            </button>
                            <button
                                type="button"
                                className={`status-btn ${status === 'draft' ? 'active' : ''}`}
                                onClick={() => setStatus('draft')}
                            >
                                <span className="status-dot draft"></span>
                                Taslak
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    {errorMessage && (
                        <div className="form-message error">
                            ⚠️ {errorMessage}
                        </div>
                    )}

                    {successMessage && (
                        <div className="form-message success">
                            ✅ {successMessage}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        className="btn primary submit-btn"
                        disabled={!canSubmit}
                    >
                        {isSubmitting ? 'Yayınlanıyor...' : 'Güncellemeyi Yayınla'}
                    </button>
                </form>
            </div>

            {/* Recent Posts */}
            <div className="panel-card recent-posts">
                <h2>Son Güncellemeler</h2>

                {postsLoading ? (
                    <div className="posts-loading">Yükleniyor...</div>
                ) : posts.length === 0 ? (
                    <div className="posts-empty">Henüz güncelleme yok</div>
                ) : (
                    <div className="posts-list">
                        {posts.slice(0, 10).map(post => (
                            <div key={post.id} className="post-item">
                                <div className="post-item-content">
                                    <span className="post-item-date">
                                        {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                                    </span>
                                    <span className="post-item-title">
                                        {post.title || '(Başlıksız)'}
                                    </span>
                                </div>
                                <div className="post-item-actions">
                                    <span className="post-stat">❤️ {post.reactions?.heart || 0}</span>
                                    <button
                                        className="btn-delete-post"
                                        onClick={() => {
                                            if (confirm('Bu güncellemeyi silmek istediğinize emin misiniz?')) {
                                                deletePost(post.id)
                                                    .then(() => setPosts(prev => prev.filter(p => p.id !== post.id)))
                                                    .catch(err => alert('Silinemedi: ' + err.message));
                                            }
                                        }}
                                        title="Sil"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
