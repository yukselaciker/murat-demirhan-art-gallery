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
    <div className="fade-in">
      <PageHeader
        title="Sergiler"
        subtitle="Sanat fuarları ve galeri sergileri"
        actions={
          <Button onClick={() => setIsFormOpen(!isFormOpen)}>
            {isFormOpen ? 'İptal' : '+ Yeni Sergi Ekle'}
          </Button>
        }
      />

      {/* Form Section */}
      {isFormOpen && (
        <Card style={{ marginBottom: 'var(--space-8)', borderLeft: '4px solid var(--color-primary-600)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>
            {editingId ? 'Sergiyi Düzenle' : 'Yeni Sergi Detayları'}
          </h3>
          <form onSubmit={handleSubmit}>
            <FormGrid columns={2}>
              <Input
                label="Sergi Adı"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Örn: Yansımalar"
              />
              <Select
                label="Sergi Türü"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                options={typeOptions}
              />
              <Input
                label="Yıl"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                required
                placeholder="2024"
              />
              <Input
                label="Şehir"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                placeholder="İstanbul"
              />
              <Input
                label="Mekan / Galeri"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                required
                placeholder="Galeri Mod"
                fullWidth
                style={{ gridColumn: '1 / -1' }}
              />
              <Textarea
                label="Açıklama (Opsiyonel)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                style={{ gridColumn: '1 / -1' }}
              />
            </FormGrid>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={resetForm} type="button">İptal</Button>
              <Button type="submit">{editingId ? 'Güncelle' : 'Kaydet'}</Button>
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
