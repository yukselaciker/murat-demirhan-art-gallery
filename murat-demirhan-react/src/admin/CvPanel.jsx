import { useState } from 'react';
import { useSiteData } from '../data/siteData.js';
import ImageUploader from './ImageUploader.jsx';

const emptyEducation = { school: '', year: '' };
const emptyAward = { title: '', org: '', year: '' };

export default function CvPanel() {
  const { data, updateCv } = useSiteData();
  const [bio, setBio] = useState(data.cv.bio || '');
  const [artistPhoto, setArtistPhoto] = useState(data.cv.artistPhoto || '');
  const [education, setEducation] = useState(data.cv.education || []);
  const [awards, setAwards] = useState(data.cv.awards || []);
  const [highlights, setHighlights] = useState(data.cv.highlights || []);
  const [message, setMessage] = useState('');

  const save = () => {
    updateCv({ bio, artistPhoto, education, awards, highlights });
    setMessage('Özgeçmiş güncellendi.');
  };

  const addEducation = () => setEducation((prev) => [...prev, { ...emptyEducation, id: crypto.randomUUID() }]);
  const addAward = () => setAwards((prev) => [...prev, { ...emptyAward, id: crypto.randomUUID() }]);
  const addHighlight = () => setHighlights((prev) => [...prev, '']);

  const updateItem = (list, setList, id, field, value) =>
    setList((prev) => prev.map((item, idx) => (item.id ? (item.id === id ? { ...item, [field]: value } : item) : idx === id ? { ...item, [field]: value } : item)));

  const deleteItem = (list, setList, id) =>
    setList((prev) => prev.filter((item, idx) => (item.id ? item.id !== id : idx !== id)));

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h2>Özgeçmiş / CV</h2>
          <p className="muted">Kısa biyografi, sanatçı portresi, eğitim, ödül ve öne çıkan sergi bilgilerini güncelleyin.</p>
        </div>
        {message && <div className="alert alert-success">{message}</div>}
      </div>

      <div className="stack">
        <label className="full">
          Kısa Biyografi
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
        </label>

        <ImageUploader
          value={artistPhoto}
          onChange={setArtistPhoto}
          label="Sanatçı Portresi"
        />

        <section>
          <div className="section-header">
            <h3>Eğitimler</h3>
            <button className="btn tiny" onClick={addEducation}>
              Eğitim Ekle
            </button>
          </div>
          <div className="table mini">
            {education.map((ed, idx) => (
              <div key={ed.id || idx} className="table-row">
                <input
                  placeholder="Okul / Program"
                  value={ed.school}
                  onChange={(e) => updateItem(education, setEducation, ed.id ?? idx, 'school', e.target.value)}
                />
                <input
                  placeholder="Yıl"
                  value={ed.year}
                  onChange={(e) => updateItem(education, setEducation, ed.id ?? idx, 'year', e.target.value)}
                />
                <button className="btn danger tiny" onClick={() => deleteItem(education, setEducation, ed.id ?? idx)}>
                  Sil
                </button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="section-header">
            <h3>Ödüller</h3>
            <button className="btn tiny" onClick={addAward}>
              Ödül Ekle
            </button>
          </div>
          <div className="table mini">
            {awards.map((aw, idx) => (
              <div key={aw.id || idx} className="table-row">
                <input
                  placeholder="Ödül"
                  value={aw.title}
                  onChange={(e) => updateItem(awards, setAwards, aw.id ?? idx, 'title', e.target.value)}
                />
                <input
                  placeholder="Kurum"
                  value={aw.org}
                  onChange={(e) => updateItem(awards, setAwards, aw.id ?? idx, 'org', e.target.value)}
                />
                <input
                  placeholder="Yıl"
                  value={aw.year}
                  onChange={(e) => updateItem(awards, setAwards, aw.id ?? idx, 'year', e.target.value)}
                />
                <button className="btn danger tiny" onClick={() => deleteItem(awards, setAwards, aw.id ?? idx)}>
                  Sil
                </button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="section-header">
            <h3>Öne Çıkanlar</h3>
            <button className="btn tiny" onClick={addHighlight}>
              Madde Ekle
            </button>
          </div>
          <div className="stack">
            {highlights.map((hl, idx) => (
              <div key={idx} className="table-row">
                <input
                  className="full"
                  value={hl}
                  onChange={(e) =>
                    setHighlights((prev) => prev.map((item, i) => (i === idx ? e.target.value : item)))
                  }
                  placeholder="Örn: 2024 Pera Müzesi kişisel sergi"
                />
                <button className="btn danger tiny" onClick={() => deleteItem(highlights, setHighlights, idx)}>
                  Sil
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="form-actions">
          <button className="btn primary" onClick={save}>
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
