import { useMemo, useState } from 'react';
import { useSiteData } from '../data/siteData.js';

const emptyArtwork = {
  title: '',
  year: '',
  technique: '',
  size: '',
  category: 'figuratif',
  tags: '',
  description: '',
  status: 'available',
  image: '',
};

export default function ArtworksPanel() {
  const { data, addArtwork, updateArtwork, deleteArtwork } = useSiteData();
  const [form, setForm] = useState(emptyArtwork);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.year || !form.technique || !form.size || !form.category) {
      setMessage('Lütfen zorunlu alanları doldurun.');
      return;
    }

    const payload = {
      ...form,
      year: form.year,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    };

    if (editingId) {
      updateArtwork(editingId, payload);
      setMessage('Eser güncellendi.');
    } else {
      addArtwork(payload);
      setMessage('Yeni eser eklendi.');
    }

    setForm(emptyArtwork);
    setEditingId(null);
  };

  const handleEdit = (art) => {
    setForm({
      ...art,
      tags: art.tags?.join(', ') || '',
    });
    setEditingId(art.id);
    setMessage('');
  };

  const handleDelete = (id) => {
    if (confirm('Bu eseri silmek istediğinize emin misiniz?')) {
      deleteArtwork(id);
      setMessage('Eser silindi.');
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyArtwork);
      }
    }
  };

  const sorted = useMemo(() => [...data.artworks].sort((a, b) => Number(b.year) - Number(a.year)), [data.artworks]);

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h2>{editingId ? 'Eseri Düzenle' : 'Yeni Eser Ekle'}</h2>
          <p className="muted">Tüm alanları eksiksiz doldurun. Görsel için URL kullanabilirsiniz.</p>
        </div>
        {message && <div className="alert alert-success">{message}</div>}
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Eser Adı *
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>
        <label>
          Yıl *
          <input name="year" value={form.year} onChange={handleChange} required />
        </label>
        <label>
          Teknik *
          <input name="technique" value={form.technique} onChange={handleChange} required />
        </label>
        <label>
          Ölçü *
          <input name="size" value={form.size} onChange={handleChange} required />
        </label>
        <label>
          Kategori *
          <select name="category" value={form.category} onChange={handleChange} required>
            <option value="figuratif">Figüratif</option>
            <option value="soyut">Soyut</option>
            <option value="peyzaj">Peyzaj</option>
            <option value="tarihsel">Tarihsel</option>
          </select>
        </label>
        <label>
          Etiketler
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="virgülle ayırın: çocuk, oyun"
          />
        </label>
        <label className="full">
          Açıklama
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
        </label>
        <label>
          Durum
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="available">Satışta</option>
            <option value="collection">Özel Koleksiyon</option>
            <option value="museum">Müze Koleksiyonu</option>
          </select>
        </label>
        <label className="full">
          Görsel URL’si
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="https://... veya /images/... "
          />
          <small className="muted">
            // TODO: Gerçek projede görsel yükleme entegrasyonu (S3 / backend) eklenmeli.
          </small>
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
            </div>
            <span>{art.year}</span>
            <span className="badge">{art.category}</span>
            <div className="row-actions">
              <button className="btn tiny" onClick={() => handleEdit(art)}>
                Düzenle
              </button>
              <button className="btn danger tiny" onClick={() => handleDelete(art.id)}>
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


