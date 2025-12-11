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

  // All hooks MUST be called before any early return!
  const sorted = useMemo(() => {
    if (!data?.exhibitions) return [];
    return [...data.exhibitions].sort((a, b) => Number(b.year) - Number(a.year));
  }, [data?.exhibitions]);

  // Loading state - AFTER all hooks
  if (!isInitialized) {
    return (
      <div className="panel">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Sergiler yükleniyor...</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.year || !form.city || !form.venue) {
      setMessage('Lütfen zorunlu alanları doldurun.');
      return;
    }
    if (editingId) {
      updateExhibition(editingId, form);
      setMessage('Sergi güncellendi.');
    } else {
      addExhibition(form);
      setMessage('Yeni sergi eklendi.');
    }
    setForm(emptyExhibition);
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
    setMessage('');
  };

  const handleDelete = (id) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteExhibition(deleteConfirm);
      setMessage('Sergi silindi.');
      if (editingId === deleteConfirm) {
        setEditingId(null);
        setForm(emptyExhibition);
      }
      setDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h2>{editingId ? 'Sergi Düzenle' : 'Yeni Sergi Ekle'}</h2>
          <p className="muted">Yıl, şehir ve mekan bilgilerini eksiksiz girin.</p>
        </div>
        {message && <div className="alert alert-success">{message}</div>}
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Sergi Adı *
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>
        <label>
          Yıl *
          <input name="year" value={form.year} onChange={handleChange} required />
        </label>
        <label>
          Şehir *
          <input name="city" value={form.city} onChange={handleChange} required />
        </label>
        <label>
          Mekan *
          <input name="venue" value={form.venue} onChange={handleChange} required />
        </label>
        <label>
          Tür
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="Kişisel Sergi">Kişisel Sergi</option>
            <option value="Karma Sergi">Karma Sergi</option>
            <option value="Grup Sergisi">Grup Sergisi</option>
            <option value="Davetli Sergi">Davetli Sergi</option>
            <option value="Sanat Fuarı">Sanat Fuarı</option>
          </select>
        </label>
        <label className="full">
          Açıklama
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
        </label>
        <div className="form-actions">
          <button type="submit" className="btn primary">
            {editingId ? 'Güncelle' : 'Kaydet'}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn ghost"
              onClick={() => {
                setEditingId(null);
                setForm(emptyExhibition);
              }}
            >
              İptal
            </button>
          )}
        </div>
      </form>

      <div className="table">
        <div className="table-head">
          <span>Sergi</span>
          <span>Yıl</span>
          <span>Şehir</span>
          <span>İşlemler</span>
        </div>

        {sorted.map((item) => (
          <div key={item.id} className="table-row">
            <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
              <strong style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{item.title}</strong>
              <p className="muted tiny" style={{ wordWrap: 'break-word', overflowWrap: 'break-word', margin: 0 }}>
                {item.venue}, {item.city} — {item.type}
              </p>
            </div>
            <span style={{ whiteSpace: 'nowrap' }}>{item.year}</span>
            <span style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{item.city}</span>
            <div className="row-actions">
              <button className="btn tiny" onClick={() => handleEdit(item)}>
                Düzenle
              </button>
              <button className="btn danger tiny" onClick={() => handleDelete(item.id)}>
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
            <p>Bu sergiyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
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
