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
            setMessages(data);
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
            <div className="panel">
                <div className="panel-header">
                    <h2>Mesajlar Yükleniyor...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="panel">
                <div className="panel-header">
                    <h2>Hata</h2>
                    <p className="muted">{error}</p>
                </div>
            </div>
        );
    }

    const unreadCount = messages.filter(m => !m.read).length;

    return (
        <div className="panel">
            <div className="panel-header">
                <h2>İletişim Mesajları</h2>
                <p className="muted">
                    {messages.length} mesaj ({unreadCount} okunmamış)
                </p>
            </div>

            {messages.length === 0 ? (
                <div className="empty-state">
                    <p>Henüz mesaj yok.</p>
                </div>
            ) : (
                <div className="messages-list">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`message-card ${!msg.read ? 'unread' : ''}`}>
                            <div className="message-header">
                                <div className="message-sender">
                                    <strong>{msg.name}</strong>
                                    <span className="message-email">{msg.email}</span>
                                </div>
                                <div className="message-date">
                                    {new Date(msg.created_at).toLocaleDateString('tr-TR', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                            {msg.subject && (
                                <div className="message-subject">
                                    <strong>Konu:</strong> {msg.subject}
                                </div>
                            )}
                            <div className="message-body">
                                {msg.message}
                            </div>
                            <div className="message-actions">
                                {!msg.read && (
                                    <button className="btn btn-sm" onClick={() => markAsRead(msg.id)}>
                                        ✓ Okundu
                                    </button>
                                )}
                                <a
                                    href={`mailto:${msg.email}?subject=Re: ${msg.subject || 'Portfolyo İletişim'}`}
                                    className="btn btn-sm btn-primary"
                                >
                                    Yanıtla
                                </a>
                                <button className="btn btn-sm btn-danger" onClick={() => deleteMessage(msg.id)}>
                                    Sil
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
