import React, { useState } from 'react';
import { PageHeader } from '../components/admin/ui/PageHeader';
import { Card } from '../components/admin/ui/Card';
import { Button } from '../components/admin/ui/Button';
import { Input } from '../components/admin/ui/Input';
import { Textarea } from '../components/admin/ui/Textarea';
import { ImageUpload } from '../components/admin/ui/ImageUpload';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function CvPanel() {
  const [cvData, setCvData] = useLocalStorage('admin_cv', {
    bio: '',
    title: 'Ressam & Sanat Eğitmeni',
    artistPhoto: null
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // Toast or notification would go here
    }, 800);
  };

  return (
    <div className="fade-in">
      <PageHeader
        title="Özgeçmiş / CV"
        subtitle="Biyografi ve profil bilgilerinizi düzenleyin"
        actions={
          <Button onClick={handleSave} isLoading={isSaving}>Değişiklikleri Kaydet</Button>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>

        {/* Left Column: Bio & Info - Takes up more space on desktop usually, but grid-cols-12 is better */}
        <div style={{ gridColumn: 'span 2' }}>
          {/* Custom Grid Helper for 2/3 vs 1/3 if we had a full grid system, but using flex/grid here */}
        </div>
      </div>

      {/* Better Layout: Grid with specific tracks */}
      <div className="cv-layout" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-6)' }}>
        {/* Desktop switch to side-by-side */}
        <style>{`
            @media (min-width: 1024px) {
                .cv-layout { grid-template-columns: 2fr 1fr; }
            }
         `}</style>

        {/* Left: Bio */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <Card>
            <Input
              label="Ünvan / Başlık"
              value={cvData.title}
              onChange={(e) => setCvData({ ...cvData, title: e.target.value })}
              placeholder="Örn: Ressam & Sanatçı"
            />
            <Textarea
              label="Biyografi"
              value={cvData.bio}
              onChange={(e) => setCvData({ ...cvData, bio: e.target.value })}
              rows={12}
              placeholder="Sanatçının özgeçmişi..."
              helperText="Markdown formatı desteklenir."
            />
          </Card>

          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Eğitim & Deneyim</h3>
              <Button variant="secondary" size="sm">+ Ekle</Button>
            </div>
            {/* Placeholder list */}
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>
              Eğitim bilgileri listesi buraya gelecek (Geliştirme aşamasında)
            </div>
          </Card>
        </div>

        {/* Right: Portrait & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <Card>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Profil Fotoğrafı</h3>
            <ImageUpload
              currentImage={cvData.artistPhoto}
              onImageSelected={(file) => {
                // Mock upload - just set preview for now
                const reader = new FileReader();
                reader.onloadend = () => setCvData({ ...cvData, artistPhoto: reader.result });
                reader.readAsDataURL(file);
              }}
              onImageRemoved={() => setCvData({ ...cvData, artistPhoto: null })}
              label=""
              helperText="400x500px önerilir"
            />
          </Card>

          <Card>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>CV Dosyası</h3>
            <Button variant="secondary" fullWidth style={{ marginBottom: '0.5rem' }}>
              📄 PDF Yükle
            </Button>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
              Ziyaretçilerin indirebileceği dosya
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
