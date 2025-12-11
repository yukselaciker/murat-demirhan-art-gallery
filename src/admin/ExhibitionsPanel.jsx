import { useMemo, useState } from 'react';
import { useSiteData } from '../data/siteData.js';

const emptyExhibition = {
  title: '',
  year: '',
  city: '',
  venue: '',
  type: 'Kişisel Sergi',
  description: '',
};

export default function ExhibitionsPanel() {
  const { data, addExhibition, updateExhibition, deleteExhibition, isInitialized } = useSiteData();
  const [form, setForm] = useState(emptyExhibition);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.year || !form.city || !form.venue) {
      setMessage('error:Lütfen zorunlu alanları doldurun.');
      return;
    }

    setIsSaving(true);
    setMessage('');

    try {
      if (editingId) {
        await updateExhibition(editingId, form);
        setMessage('success:Sergi güncellendi.');
      } else {
        await addExhibition(form);
        setMessage('success:Yeni sergi eklendi.');
      }
      setForm(emptyExhibition);
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

  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
    setIsFormOpen(true);
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => setDeleteConfirm(id);
  const cancelDelete = () => setDeleteConfirm(null);

  const confirmDelete = async () => {
    if (deleteConfirm) {
      await deleteExhibition(deleteConfirm);
      setMessage('success:Sergi silindi.');
      if (editingId === deleteConfirm) {
        setEditingId(null);
        setForm(emptyExhibition);
      }
      setDeleteConfirm(null);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const cancelForm = () => {
    setEditingId(null);
    setForm(emptyExhibition);
    setIsFormOpen(false);
  };

  const sorted = useMemo(() => {
    if (!data?.exhibitions) return [];
    return [...data.exhibitions].sort((a, b) => Number(b.year) - Number(a.year));
  }, [data?.exhibitions]);

  const messageType = message.split(':')[0];
  const messageText = message.split(':').slice(1).join(':');

  if (!isInitialized) {
    return (
      <div className="artworks-panel">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="artworks-panel">
      {/* Header */}
      <div className="panel-header-modern">
        <div>
          <h2>🏛️ Sergiler</h2>
          <p className="subtitle">{sorted.length} sergi listeleniyor</p>
        </div>
        <button
          className="btn-add-new"
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          {isFormOpen ? '✕ Kapat' : '+ Yeni Sergi'}
        </button>
      </div>

      {/* Toast */}
      {message && (
        <div className={`toast ${messageType}`}>
          {messageType === 'success' ? '✅' : '❌'} {messageText}
        </div>
      )}

      {/* Form */}
      <div className={`form-container ${isFormOpen ? 'open' : ''}`}>
        <div className="form-card">
          <h3>{editingId ? '✏️ Sergiyi Düzenle' : '➕ Yeni Sergi Ekle'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid-modern">
              <div className="form-group">
                <label>Sergi Adı *</label>
                <input name="title" value={form.title} onChange={handleChange} required placeholder="Örn: Yansımalar" />
              </div>
              <div className="form-group">
                <label>Yıl *</label>
                <input name="year" type="number" value={form.year} onChange={handleChange} required placeholder="2024" />
              </div>
              <div className="form-group">
                <label>Şehir *</label>
                <input name="city" value={form.city} onChange={handleChange} required placeholder="İstanbul" />
              </div>
              <div className="form-group">
                <label>Mekan *</label>
                <input name="venue" value={form.venue} onChange={handleChange} required placeholder="Galeri Mod" />
              </div>
              <div className="form-group full-width">
                <label>Tür</label>
                <select name="type" value={form.type} onChange={handleChange}>
                  <option value="Kişisel Sergi">Kişisel Sergi</option>
                  <option value="Karma Sergi">Karma Sergi</option>
                  <option value="Grup Sergisi">Grup Sergisi</option>
                  <option value="Davetli Sergi">Davetli Sergi</option>
                  <option value="Sanat Fuarı">Sanat Fuarı</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label>Açıklama</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Sergi hakkında detaylar..." />
              </div>
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn-primary" disabled={isSaving}>
                {isSaving ? <><span className="spinner-small"></span> Kaydediliyor...</> : (editingId ? 'Güncelle' : 'Kaydet')}
              </button>
              {(editingId || isFormOpen) && (
                <button type="button" className="btn-secondary" onClick={cancelForm}>İptal</button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Grid List */}
      <div className="artworks-grid">
        {sorted.map((item) => (
          <div key={item.id} className="artwork-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1.5rem', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span className="category-badge">{item.year}</span>
                <span className="meta-item">{item.city}</span>
              </div>

              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{item.title}</h4>
              <div style={{ color: 'var(--slate-600)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                📍 {item.venue}
              </div>
              <div style={{ color: 'var(--slate-500)', fontSize: '0.85rem' }}>
                {item.type}
              </div>
            </div>

            <div className="card-actions">
              <button className="action-btn edit" onClick={() => handleEdit(item)} title="Düzenle">✏️</button>
              <button className="action-btn delete" onClick={() => handleDelete(item.id)} title="Sil">🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sorted.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🏛️</div>
          <h3>Henüz sergi eklenmemiş</h3>
          <p>Yeni sergi eklemek için yukarıdaki butonu kullanın.</p>
        </div>
      )}

      {/* FAB */}
      <button className="fab" onClick={() => { setIsFormOpen(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>+</button>

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>🗑️ Sergi Silinecek</h3>
            <p>Bu sergiyi silmek istediğinize emin misiniz?</p>
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
