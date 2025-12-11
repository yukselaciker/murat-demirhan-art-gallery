import { useState, useEffect } from 'react';

export default function MessagesPanel() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/messages');
            if (!res.ok) throw new Error('Failed to fetch messages');
            const data = await res.json();
            // Sort by date desc
            const sorted = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setMessages(sorted);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await fetch(`/api/messages?id=${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ read: true })
            });
            setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    };

    const deleteMessage = async (id) => {
        if (!confirm('Bu mesajı silmek istediğinize emin misiniz?')) return;
        try {
            await fetch(`/api/messages?id=${id}`, { method: 'DELETE' });
            setMessages(prev => prev.filter(m => m.id !== id));
        } catch (err) {
            console.error('Failed to delete:', err);
        }
    };

    if (loading) {
        return (
            <div className="artworks-panel">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Mesajlar yükleniyor...</p>
                </div>
            </div>
        );
    }

    const unreadCount = messages.filter(m => !m.read).length;

    return (
        <div className="artworks-panel">
            <div className="panel-header-modern">
                <div>
                    <h2>✉️ Mesajlar</h2>
                    <p className="subtitle">{messages.length} mesaj ({unreadCount} okunmamış)</p>
                </div>
                {/* Refresh button could go here */}
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {messages.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📭</div>
                        <h3>Hiç mesaj yok</h3>
                        <p>Web sitenizden gelen iletişim formları burada listelenir.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                style={{
                                    padding: '1.5rem',
                                    borderBottom: '1px solid var(--slate-100)',
                                    backgroundColor: msg.read ? 'white' : 'var(--indigo-50)',
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontWeight: msg.read ? 600 : 700, fontSize: '1rem', color: 'var(--slate-900)' }}>
                                            {msg.name}
                                        </span>
                                        <span style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>&lt;{msg.email}&gt;</span>
                                        {!msg.read && <span className="category-badge" style={{ fontSize: '0.7rem' }}>YENİ</span>}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                                        {new Date(msg.created_at).toLocaleDateString('tr-TR', {
                                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </div>
                                </div>

                                {msg.subject && (
                                    <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--slate-800)' }}>
                                        {msg.subject}
                                    </div>
                                )}

                                <div style={{ color: 'var(--slate-600)', lineHeight: 1.5, marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>
                                    {msg.message}
                                </div>

                                <div className="card-actions" style={{ borderTop: 'none', padding: 0 }}>
                                    {!msg.read && (
                                        <button className="btn secondary" onClick={() => markAsRead(msg.id)} style={{ height: '32px', fontSize: '0.8rem', padding: '0 0.75rem' }}>
                                            ✓ Okundu işaretle
                                        </button>
                                    )}
                                    <a
                                        href={`mailto:${msg.email}?subject=Re: ${msg.subject || 'Portfolyo İletişim'}`}
                                        className="btn primary"
                                        style={{ height: '32px', fontSize: '0.8rem', padding: '0 0.75rem', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                                    >
                                        ↪ Yanıtla
                                    </a>
                                    <div style={{ flex: 1 }}></div>
                                    <button className="btn-icon" onClick={() => deleteMessage(msg.id)} title="Sil">
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
