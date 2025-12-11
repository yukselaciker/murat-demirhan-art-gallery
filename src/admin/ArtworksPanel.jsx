import { useMemo, useState } from 'react';
import { useSiteData } from '../data/siteData.js';
import ImageUploader from './ImageUploader.jsx';

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
  const [isSaving, setIsSaving] = useState(false); // MOVED HERE - hooks must be before returns!

  // IMPORTANT: Tüm hook'lar early return'den ÖNCE çağrılmalı!
  // React Hooks Kuralı: Hook'lar koşulsuz ve aynı sırada çağrılmalı
  const sorted = useMemo(
    () => (data?.artworks ? [...data.artworks].sort((a, b) => Number(b.year) - Number(a.year)) : []),
    [data]
  );

  // Debug log
  console.log('[ArtworksPanel] isInitialized:', isInitialized, 'artworks count:', data?.artworks?.length);

  // Loading state (hook'lardan SONRA early return!)
  if (!isInitialized) {
    return (
      <div className="panel">
        <div className="panel-header">
          <h2>Eserler Yükleniyor...</h2>
          <p className="muted">API'den veri çekiliyor, lütfen bekleyin.</p>
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
      setMessage('Eser adı gereklidir.');
      return;
    }

    if (rawYear && Number.isNaN(parsedYear)) {
      setMessage('Yıl sadece rakam olmalıdır.');
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
        setMessage('✅ Eser güncellendi!');
      } else {
        await addArtwork(payload);
        setMessage('✅ Yeni eser eklendi!');
      }

      // Reset form AFTER successful save
      setForm(emptyArtwork);
      setEditingId(null);

      // Auto-hide success message after 3 seconds
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      console.error('Save error:', error);
      setMessage('❌ Kaydetme hatası: ' + error.message);
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
    setMessage('');
  };

  const handleDelete = (id) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteArtwork(deleteConfirm);
      setMessage('Eser silindi.');
      if (editingId === deleteConfirm) {
        setEditingId(null);
        setForm(emptyArtwork);
      }
      setDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleSetFeatured = (id) => {
    setFeaturedArtwork(id);
    setMessage('Öne çıkan eser ayarlandı.');
  };

  // sorted artık yukarıda tanımlandı, burada tekrar tanımlamaya gerek yok

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h2>{editingId ? 'Eseri Düzenle' : 'Yeni Eser Ekle'}</h2>
          <p className="muted">Tüm alanları eksiksiz doldurun. Cihazınızdan direkt resim yükleyebilirsiniz.</p>
        </div>
        {message && <div className="alert alert-success">{message}</div>}
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Eser Adı *
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>
        <label>
          Yıl (opsiyonel)
          <input name="year" value={form.year} onChange={handleChange} />
        </label>
        <label>
          Teknik (opsiyonel)
          <input name="technique" value={form.technique} onChange={handleChange} />
        </label>
        <label>
          Ölçü (opsiyonel)
          <input name="size" value={form.size} onChange={handleChange} />
        </label>
        <label>
          Kategori *
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
        </label>

        <ImageUploader
          value={form.image}
          onChange={(dataUrl) => setForm(prev => ({ ...prev, image: dataUrl }))}
          label="Eser Görseli (opsiyonel)"
        />

        <div className="form-actions">
          <button type="submit" className="btn primary" disabled={isSaving}>
            {isSaving ? '⏳ Kaydediliyor...' : (editingId ? 'Güncelle' : 'Kaydet')}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn ghost"
              onClick={() => {
                setEditingId(null);
                setForm(emptyArtwork);
              }}
            >
              İptal
            </button>
          )}
        </div>
      </form>

      <div className="table">
        <div className="table-head">
          <span>Eser</span>
          <span>Yıl</span>
          <span>Kategori</span>
          <span>İşlemler</span>
        </div>
        {sorted.map((art) => (
          <div key={art.id} className="table-row">
            <div>
              <strong>{art.title}</strong>
              <p className="muted tiny">{art.technique}</p>
              {data.featuredArtworkId === art.id && (
                <span className="badge" style={{ backgroundColor: '#10b981', color: 'white', marginTop: '4px' }}>
                  ⭐ Öne Çıkan
                </span>
              )}
            </div>
            <span>{art.year}</span>
            <span className="badge">{art.category}</span>
            <div className="row-actions">
              <button className="btn tiny" onClick={() => handleEdit(art)}>
                Düzenle
              </button>
              <button
                className="btn tiny"
                onClick={() => handleSetFeatured(art.id)}
                style={{
                  backgroundColor: data.featuredArtworkId === art.id ? '#10b981' : 'transparent',
                  color: data.featuredArtworkId === art.id ? 'white' : 'inherit'
                }}
              >
                ⭐ Öne Çıkar
              </button>
              <button className="btn danger tiny" onClick={() => handleDelete(art.id)}>
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Silme Onay Dialog */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Emin misiniz?</h3>
            <p>Bu eseri silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
            <div className="modal-actions">
              <button className="btn ghost" onClick={cancelDelete}>
                İptal
              </button>
              <button className="btn danger" onClick={confirmDelete}>
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
