import React, { useState, useMemo } from 'react';
import { PageHeader } from '../components/admin/ui/PageHeader';
import { Card } from '../components/admin/ui/Card';
import { Button } from '../components/admin/ui/Button';
import { Input } from '../components/admin/ui/Input';
import { Select } from '../components/admin/ui/Select';
import { Textarea } from '../components/admin/ui/Textarea';
import { FormGrid } from '../components/admin/ui/FormGrid';
import { EmptyState } from '../components/admin/ui/EmptyState';
import { Badge } from '../components/admin/ui/Badge';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function ExhibitionsPanel() {
  const [exhibitions, setExhibitions] = useLocalStorage('admin_exhibitions', []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    year: '',
    city: '',
    venue: '',
    type: 'Kişisel Sergi',
    description: ''
  });

  // Type Options
  const typeOptions = [
    { value: 'Kişisel Sergi', label: 'Kişisel Sergi' },
    { value: 'Karma Sergi', label: 'Karma Sergi' },
    { value: 'Grup Sergisi', label: 'Grup Sergisi' },
    { value: 'Davetli Sergi', label: 'Davetli Sergi' },
    { value: 'Sanat Fuarı', label: 'Sanat Fuarı' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setExhibitions(prev => prev.map(ex => ex.id === editingId ? { ...formData, id: editingId } : ex));
    } else {
      setExhibitions(prev => [{ ...formData, id: Date.now() }, ...prev]);
    }
    resetForm();
  };

  const handleEdit = (ex) => {
    setFormData(ex);
    setEditingId(ex.id);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (confirm('Bu sergiyi silmek istediğinize emin misiniz?')) {
      setExhibitions(prev => prev.filter(ex => ex.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({ title: '', year: '', city: '', venue: '', type: 'Kişisel Sergi', description: '' });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const sortedExhibitions = useMemo(() => {
    return [...exhibitions].sort((a, b) => b.year - a.year);
  }, [exhibitions]);

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
          <form className="stacked-form" onSubmit={handleSubmit}>
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
        </Card>
      )}

      {/* List Section */}
      {sortedExhibitions.length === 0 ? (
        <EmptyState
          icon="🏛️"
          title="Kayıtlı Sergi Yok"
          description="Geçmiş veya gelecek sergilerinizi ekleyerek başlayın."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
          {sortedExhibitions.map((ex) => (
            <Card key={ex.id} className="hover-scale">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <Badge variant="neutral">{ex.year}</Badge>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{ex.city}</span>
              </div>

              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: 700 }}>{ex.title}</h4>

              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginBottom: '0.25rem' }}>
                📍 {ex.venue}
              </div>
              <div style={{ color: 'var(--color-primary-600)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '1rem' }}>
                {ex.type}
              </div>

              <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
                <Button variant="secondary" size="sm" fullWidth onClick={() => handleEdit(ex)}>Düzenle</Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(ex.id)} style={{ color: 'var(--color-danger)' }}>Sil</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
