import { useMemo, useState } from 'react';
import { useSiteData } from '../data/siteData.js';
import ImageUploader from './ImageUploader.jsx';
import './ArtworksPanel.css';

const emptyArtwork = {
  title: '',
  year: '',
  technique: '',
  size: '',
  category: '',
  image: '',
};

export default function ArtworksPanel() {
  const { data, addArtwork, updateArtwork, deleteArtwork, setFeaturedArtwork, isInitialized } = useSiteData();
  const [form, setForm] = useState(emptyArtwork);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Sort by created_at (newest first)
  const sorted = useMemo(() => {
    if (!data?.artworks) return [];
    return [...data.artworks].sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return dateB - dateA;
    });
  }, [data]);

  // Loading state
  if (!isInitialized) {
    return (
      <div className="artworks-panel">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Eserler yükleniyor...</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = form.title?.trim();
    const rawYear = form.year?.toString().trim();
    const parsedYear = rawYear ? Number(rawYear) : null;

    if (!title) {
      setMessage('error:Eser adı gereklidir.');
      return;
    }

    if (rawYear && Number.isNaN(parsedYear)) {
      setMessage('error:Yıl sadece rakam olmalıdır.');
      return;
    }

    const payload = {
      ...form,
      title,
      year: parsedYear,
      technique: form.technique?.trim() || null,
      size: form.size?.trim() || null,
      category: form.category?.trim() || '',
      image: form.image?.trim() || '',
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    };

    setIsSaving(true);
    setMessage('');

    try {
      if (editingId) {
        await updateArtwork(editingId, payload);
        setMessage('success:Eser güncellendi!');
      } else {
        await addArtwork(payload);
        setMessage('success:Yeni eser eklendi!');
      }

      setForm(emptyArtwork);
      setEditingId(null);
      setIsFormOpen(false);
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      console.error('Save error:', error);
      setMessage('error:Kaydetme hatası: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (art) => {
    setForm({
      title: art.title || '',
      year: art.year ? String(art.year) : '',
      technique: art.technique || '',
      size: art.size || '',
      category: art.category || '',
      image: art.image || art.image_url || art.imageUrl || '',
      tags: art.tags?.join(', ') || '',
    });
    setEditingId(art.id);
    setIsFormOpen(true);
    setMessage('');
    // Scroll to form on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => setDeleteConfirm(id);
  const cancelDelete = () => setDeleteConfirm(null);

  const confirmDelete = async () => {
    if (deleteConfirm) {
      await deleteArtwork(deleteConfirm);
      setMessage('success:Eser silindi.');
      if (editingId === deleteConfirm) {
        setEditingId(null);
        setForm(emptyArtwork);
      }
      setDeleteConfirm(null);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleSetFeatured = (id) => {
    setFeaturedArtwork(id);
    setMessage('success:Öne çıkan eser ayarlandı.');
    setTimeout(() => setMessage(''), 3000);
  };

  const cancelForm = () => {
    setEditingId(null);
    setForm(emptyArtwork);
    setIsFormOpen(false);
  };

  const getImageUrl = (art) => {
    const url = art.image || art.image_url || art.imageUrl;
    if (!url) return null;
    return url;
  };

  const messageType = message.split(':')[0];
  const messageText = message.split(':').slice(1).join(':');

  return (
    <div className="artworks-panel">
      {/* Header with Toggle */}
      <div className="panel-header-modern">
        <div>
          <h2>🎨 Eserler</h2>
          <p className="subtitle">{sorted.length} eser kayıtlı</p>
        </div>
        <button
          className="btn-add-new"
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          {isFormOpen ? '✕ Kapat' : '+ Yeni Eser'}
        </button>
      </div>

      {/* Toast Message */}
      {message && (
        <div className={`toast ${messageType}`}>
          {messageType === 'success' ? '✅' : '❌'} {messageText}
        </div>
      )}

      {/* Collapsible Form */}
      <div className={`form-container ${isFormOpen ? 'open' : ''}`}>
        <div className="form-card">
          <h3>{editingId ? '✏️ Eseri Düzenle' : '➕ Yeni Eser Ekle'}</h3>

          <form onSubmit={handleSubmit}>
            <div className="form-grid-modern">
              <div className="form-group">
                <label>Eser Adı *</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Eserin adını yazın"
                  required
                />
              </div>

              <div className="form-group">
                <label>Yıl</label>
                <input
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  placeholder="2024"
                  type="number"
                />
              </div>

              <div className="form-group">
                <label>Teknik</label>
                <input
                  name="technique"
                  value={form.technique}
                  onChange={handleChange}
                  placeholder="Tuval üzerine yağlıboya"
                />
              </div>

              <div className="form-group">
                <label>Ölçü</label>
                <input
                  name="size"
                  value={form.size}
                  onChange={handleChange}
                  placeholder="100x80 cm"
                />
              </div>

              <div className="form-group full-width">
                <label>Kategori *</label>
                <select name="category" value={form.category} onChange={handleChange} required>
                  <option value="">Kategori Seçin</option>
                  <option value="Yağlıboya">Yağlıboya</option>
                  <option value="Akrilik">Akrilik</option>
                  <option value="Suluboya">Suluboya</option>
                  <option value="Karikatür">Karikatür</option>
                  <option value="Desen">Desen</option>
                  <option value="Dijital">Dijital</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>
            </div>

            <div className="form-group full-width">
              <ImageUploader
                value={form.image}
                onChange={(url) => setForm(prev => ({ ...prev, image: url }))}
                label="Eser Görseli"
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn-primary" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <span className="spinner-small"></span>
                    Kaydediliyor...
                  </>
                ) : (
                  editingId ? 'Güncelle' : 'Kaydet'
                )}
              </button>
              {(editingId || isFormOpen) && (
                <button type="button" className="btn-secondary" onClick={cancelForm}>
                  İptal
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Card Grid */}
      <div className="artworks-grid">
        {sorted.map((art) => (
          <div key={art.id} className={`artwork-card ${data.featuredArtworkId === art.id ? 'featured' : ''}`}>
            {/* Card Image */}
            <div className="card-image">
              {getImageUrl(art) ? (
                <img src={getImageUrl(art)} alt={art.title} loading="lazy" />
              ) : (
                <div className="no-image">🖼️</div>
              )}
              {data.featuredArtworkId === art.id && (
                <span className="featured-badge">⭐ Öne Çıkan</span>
              )}
            </div>

            {/* Card Content */}
            <div className="card-content">
              <h4>{art.title}</h4>
              <div className="card-meta">
                {art.year && <span className="meta-item">📅 {art.year}</span>}
                {art.technique && <span className="meta-item">🎨 {art.technique}</span>}
              </div>
              <span className="category-badge">{art.category}</span>
            </div>

            {/* Card Actions */}
            <div className="card-actions">
              <button className="action-btn edit" onClick={() => handleEdit(art)} title="Düzenle">
                ✏️
              </button>
              <button
                className={`action-btn star ${data.featuredArtworkId === art.id ? 'active' : ''}`}
                onClick={() => handleSetFeatured(art.id)}
                title="Öne Çıkar"
              >
                ⭐
              </button>
              <button className="action-btn delete" onClick={() => handleDelete(art.id)} title="Sil">
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sorted.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🎨</div>
          <h3>Henüz eser yok</h3>
          <p>İlk eserinizi eklemek için yukarıdaki "Yeni Eser" butonuna tıklayın.</p>
        </div>
      )}

      {/* Floating Action Button (Mobile) */}
      <button
        className="fab"
        onClick={() => {
          setIsFormOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        +
      </button>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>🗑️ Eser Silinecek</h3>
            <p>Bu eseri silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
            <div className="modal-buttons">
              <button className="btn-secondary" onClick={cancelDelete}>İptal</button>
              <button className="btn-danger" onClick={confirmDelete}>Evet, Sil</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
