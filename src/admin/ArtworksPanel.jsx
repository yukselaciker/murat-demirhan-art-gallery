import React, { useState, useMemo } from 'react';
import { PageHeader } from '../components/admin/ui/PageHeader';
import { Card } from '../components/admin/ui/Card';
import { Button } from '../components/admin/ui/Button';
import { Input } from '../components/admin/ui/Input';
import { Select } from '../components/admin/ui/Select';
import { FormGrid } from '../components/admin/ui/FormGrid';
import { ImageUpload } from '../components/admin/ui/ImageUpload';
import { EmptyState } from '../components/admin/ui/EmptyState';
import { Badge } from '../components/admin/ui/Badge';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function ArtworksPanel() {
  const [artworks, setArtworks] = useLocalStorage('admin_artworks', []);

  const [formData, setFormData] = useState({
    title: '', year: '', technique: '', size: '', category: '', image: '', tags: ''
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const categoryOptions = [
    { value: 'Yağlıboya', label: 'Yağlıboya' },
    { value: 'Akrilik', label: 'Akrilik' },
    { value: 'Suluboya', label: 'Suluboya' },
    { value: 'Karikatür', label: 'Karikatür' },
    { value: 'Desen', label: 'Desen' },
    { value: 'Dijital', label: 'Dijital' },
    { value: 'Diğer', label: 'Diğer' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setArtworks(prev => prev.map(a => a.id === editingId ? { ...formData, id: editingId } : a));
    } else {
      setArtworks(prev => [{ ...formData, id: Date.now() }, ...prev]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ title: '', year: '', technique: '', size: '', category: '', image: '', tags: '' });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (art) => {
    setFormData(art);
    setEditingId(art.id);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (confirm('Eseri silmek istediğinize emin misiniz?')) {
      setArtworks(prev => prev.filter(a => a.id !== id));
    }
  };

  // Convert image object/file to URL for preview if needed
  // In our simple mock specific implementation, we just expect data URL or string.

  const sortedArtworks = useMemo(() => [...artworks].reverse(), [artworks]); // Newest first if array appended

  return (
    <div className="artworks-panel">
      {/* Header with Toggle */}
      <div className="panel-header-modern">
        <div className="panel-heading">
          <p className="eyebrow">Galeri Yönetimi</p>
          <h2>Eserler</h2>
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
          <div className="form-header">
            <p className="eyebrow">Form</p>
            <h3>{editingId ? 'Eseri Düzenle' : 'Yeni Eser Ekle'}</h3>
            <p className="subtitle">Tüm alanları eksiksiz doldurun ve kaydedin.</p>
          </div>

          <form className="stacked-form" onSubmit={handleSubmit}>
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

              {/* Right: Fields */}
              <div style={{ order: 2 }}>
                <FormGrid columns={2}>
                  <Input
                    label="Eser Adı *"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Örn: Gece Yürüyüşü"
                    fullWidth
                    style={{ gridColumn: '1 / -1' }}
                  />
                  <Select
                    label="Kategori *"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    options={categoryOptions}
                    required
                  />
                  <Input
                    label="Yıl"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2024"
                  />
                  <Input
                    label="Teknik"
                    value={formData.technique}
                    onChange={(e) => setFormData({ ...formData, technique: e.target.value })}
                    placeholder="Tuval üzeri yağlıboya"
                  />
                  <Input
                    label="Ölçü (cm)"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    placeholder="100x80"
                  />
                </FormGrid>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <Button variant="ghost" onClick={resetForm} type="button">İptal</Button>
                  <Button type="submit">{editingId ? 'Güncelle' : 'Kaydet'}</Button>
                </div>
              </div>
            </div>
          </form>
        </Card>
      )}

      {sortedArtworks.length === 0 ? (
        <EmptyState
          icon="🎨"
          title="Eser Bulunamadı"
          description="Portföyünüze henüz hiç eser eklemediniz."
        />
      ) : (
        <div className="artworks-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 'var(--space-6)'
        }}>
          {sortedArtworks.map((art) => (
            <Card key={art.id} noPadding className="hover-scale">
              <div style={{ position: 'relative', aspectRatio: '4/3', backgroundColor: 'var(--color-neutral-100)' }}>
                {art.image ? (
                  <img src={art.image} alt={art.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '2rem' }}>🖼️</div>
                )}
                <span className="category-badge" style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(255,255,255,0.9)' }}>
                  {art.category}
                </span>
              </div>

              <div style={{ padding: '1rem' }}>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: 700 }}>{art.title}</h4>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem' }}>
                  <span>{art.year}</span>
                  <span>•</span>
                  <span>{art.technique}</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', display: 'flex' }}>
                <button
                  style={{ flex: 1, border: 'none', background: 'transparent', padding: '0.75rem', cursor: 'pointer', borderRight: '1px solid var(--border-color)' }}
                  onClick={() => handleEdit(art)}
                >
                  ✏️ Düzenle
                </button>
                <button
                  style={{ flex: 1, border: 'none', background: 'transparent', padding: '0.75rem', cursor: 'pointer', color: 'var(--color-danger)' }}
                  onClick={() => handleDelete(art.id)}
                >
                  🗑️ Sil
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
