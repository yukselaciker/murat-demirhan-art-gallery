import { useState, useEffect } from 'react';
import { useSiteData } from '../data/siteData.js';
import ImageUploader from './ImageUploader.jsx';

const emptyEducation = { school: '', year: '' };
const emptyAward = { title: '', org: '', year: '' };

export default function CvPanel() {
  const { data, updateCv } = useSiteData();

  // Safe access with fallbacks
  const cv = data?.cv || {};
  const [bio, setBio] = useState(cv.bio || '');
  const [artistPhoto, setArtistPhoto] = useState(cv.artistPhoto || '');
  const [education, setEducation] = useState(cv.education || []);
  const [awards, setAwards] = useState(cv.awards || []);
  const [highlights, setHighlights] = useState(cv.highlights || []);
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Update form when async data loads
  useEffect(() => {
    if (data?.cv) {
      setBio(data.cv.bio || '');
      setArtistPhoto(data.cv.artistPhoto || '');
      setEducation(data.cv.education || []);
      setAwards(data.cv.awards || []);
      setHighlights(data.cv.highlights || []);
    }
  }, [data?.cv]);

  const save = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      await updateCv({ bio, artistPhoto, education, awards, highlights });
      setMessage('success:Özgeçmiş güncellendi.');
      setTimeout(() => setMessage(''), 3000);
    } catch (e) {
      console.error(e);
      setMessage('error:Kaydetme hatası.');
    } finally {
      setIsSaving(false);
    }
  };

  const addEducation = () => setEducation((prev) => [...prev, { ...emptyEducation, id: crypto.randomUUID() }]);
  const addAward = () => setAwards((prev) => [...prev, { ...emptyAward, id: crypto.randomUUID() }]);
  const addHighlight = () => setHighlights((prev) => [...prev, '']);

  const updateItem = (list, setList, id, field, value) =>
    setList((prev) => prev.map((item, idx) => (item.id ? (item.id === id ? { ...item, [field]: value } : item) : idx === id ? { ...item, [field]: value } : item)));

  const deleteItem = (list, setList, id) =>
    setList((prev) => prev.filter((item, idx) => (item.id ? item.id !== id : idx !== id)));

  const messageType = message.split(':')[0];
  const messageText = message.split(':').slice(1).join(':');

  return (
    <div className="artworks-panel">
      <div className="panel-header-modern">
        <div>
          <h2>📄 Özgeçmiş / CV</h2>
          <p className="subtitle">Biyografi, portre ve kariyer detaylarını yönetin.</p>
        </div>
        <button className="btn-add-new" onClick={save} disabled={isSaving}>
          {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </div>

      {message && (
        <div className={`toast ${messageType}`}>
          {messageType === 'success' ? '✅' : '❌'} {messageText}
        </div>
      )}

      <div className="panel" style={{ gap: '2rem' }}>
        {/* BIO & PHOTO Section */}
        <div className="form-grid-modern" style={{ alignItems: 'start' }}>
          <div className="card">
            <h3>Kısa Biyografi</h3>
            <div className="form-group">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={8}
                placeholder="Sanatçı hakkında kısa bir yazı..."
                style={{ minHeight: '200px' }}
              />
            </div>
          </div>

          <div className="card">
            <h3>Sanatçı Portresi</h3>
            <div className="form-group">
              <ImageUploader
                value={artistPhoto}
                onChange={setArtistPhoto}
                label="Fotoğraf Yükle"
              />
            </div>
          </div>
        </div>

        {/* EDUCATION Section */}
        <div className="card">
          <div className="panel-section-header">
            <h2>Eğitimler</h2>
            <button className="btn secondary" onClick={addEducation}>+ Ekle</button>
          </div>

          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Okul / Program</th>
                  <th style={{ width: '150px' }}>Yıl</th>
                  <th style={{ width: '80px' }}></th>
                </tr>
              </thead>
              <tbody>
                {education.map((ed, idx) => (
                  <tr key={ed.id || idx}>
                    <td>
                      <input
                        className="no-border-input"
                        value={ed.school}
                        onChange={(e) => updateItem(education, setEducation, ed.id ?? idx, 'school', e.target.value)}
                        placeholder="Okul adı"
                      />
                    </td>
                    <td>
                      <input
                        className="no-border-input"
                        value={ed.year}
                        onChange={(e) => updateItem(education, setEducation, ed.id ?? idx, 'year', e.target.value)}
                        placeholder="Tarih"
                      />
                    </td>
                    <td>
                      <button className="btn-icon" onClick={() => deleteItem(education, setEducation, ed.id ?? idx)} title="Sil">
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
                {education.length === 0 && (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', color: 'var(--slate-400)', padding: '2rem' }}>
                      Henüz eğitim bilgisi eklenmemiş
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* AWARDS Section */}
        <div className="card">
          <div className="panel-section-header">
            <h2>Ödüller</h2>
            <button className="btn secondary" onClick={addAward}>+ Ekle</button>
          </div>

          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Ödül</th>
                  <th>Kurum</th>
                  <th style={{ width: '150px' }}>Yıl</th>
                  <th style={{ width: '80px' }}></th>
                </tr>
              </thead>
              <tbody>
                {awards.map((aw, idx) => (
                  <tr key={aw.id || idx}>
                    <td>
                      <input
                        className="no-border-input"
                        value={aw.title}
                        onChange={(e) => updateItem(awards, setAwards, aw.id ?? idx, 'title', e.target.value)}
                        placeholder="Ödül adı"
                      />
                    </td>
                    <td>
                      <input
                        className="no-border-input"
                        value={aw.org}
                        onChange={(e) => updateItem(awards, setAwards, aw.id ?? idx, 'org', e.target.value)}
                        placeholder="Kurum"
                      />
                    </td>
                    <td>
                      <input
                        className="no-border-input"
                        value={aw.year}
                        onChange={(e) => updateItem(awards, setAwards, aw.id ?? idx, 'year', e.target.value)}
                        placeholder="Yıl"
                      />
                    </td>
                    <td>
                      <button className="btn-icon" onClick={() => deleteItem(awards, setAwards, aw.id ?? idx)} title="Sil">
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
                {awards.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--slate-400)', padding: '2rem' }}>
                      Henüz ödül eklenmemiş
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* HIGHLIGHTS Section */}
        <div className="card">
          <div className="panel-section-header">
            <h2>Öne Çıkanlar</h2>
            <button className="btn secondary" onClick={addHighlight}>+ Ekle</button>
          </div>

          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Madde (Hakkında kısmında liste olarak görünür)</th>
                  <th style={{ width: '80px' }}></th>
                </tr>
              </thead>
              <tbody>
                {highlights.map((hl, idx) => (
                  <tr key={idx}>
                    <td>
                      <input
                        className="no-border-input"
                        value={hl}
                        onChange={(e) =>
                          setHighlights((prev) => prev.map((item, i) => (i === idx ? e.target.value : item)))
                        }
                        placeholder="Örn: 2024 Pera Müzesi kişisel sergi"
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td>
                      <button className="btn-icon" onClick={() => deleteItem(highlights, setHighlights, idx)} title="Sil">
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
                {highlights.length === 0 && (
                  <tr>
                    <td colSpan="2" style={{ textAlign: 'center', color: 'var(--slate-400)', padding: '2rem' }}>
                      Henüz öne çıkan madde eklenmemiş
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Save Button (Bottom) */}
        <div className="form-buttons">
          <button className="btn-primary" onClick={save} disabled={isSaving} style={{ width: '100%', padding: '1rem' }}>
            {isSaving ? 'Kaydediliyor...' : 'Tüm Değişiklikleri Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
}
