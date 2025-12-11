import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/admin/ui/PageHeader';
import { Card } from '../components/admin/ui/Card';
import { Button } from '../components/admin/ui/Button';
import { Badge } from '../components/admin/ui/Badge';
import { MessageSkeleton } from '../components/admin/ui/MessageSkeleton'; // Explicit requirement
import { EmptyState } from '../components/admin/ui/EmptyState';
import { useAdmin } from '../context/AdminContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function MessagesPanel() {
    // Using LocalStorage for persistence as requested
    const [messages, setMessages] = useLocalStorage('admin_messages', [
        {
            id: 1,
            name: 'Ahmet Yılmaz',
            email: 'ahmet@example.com',
            message: 'Sergi açılışına katılmak istiyorum, davetiye alabilir miyim?',
            date: '2024-03-10T14:30:00',
            read: false
        },
        {
            id: 2,
            name: 'Ayşe Demir',
            email: 'ayse@artgallery.com',
            message: 'Eserleriniz hakkında fiyat bilgisi alabilir miyim?',
            date: '2024-03-09T09:15:00',
            read: true
        }
    ]);

    const [isLoading, setIsLoading] = useState(true);

    // Simulate loading delay for skeleton demo
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleMarkAsRead = (id) => {
        setMessages(prev => prev.map(msg =>
            msg.id === id ? { ...msg, read: true } : msg
        ));
    };

    const handleDelete = (id) => {
        if (confirm('Bu mesajı silmek istediğinize emin misiniz?')) {
            setMessages(prev => prev.filter(msg => msg.id !== id));
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const unreadCount = messages.filter(m => !m.read).length;

    return (
        <div className="fade-in">
            <PageHeader
                title="Mesajlar"
                subtitle="Web sitesinden gelen iletişim formları"
                actions={
                    unreadCount > 0 && <Badge variant="primary">{unreadCount} Okunmamış</Badge>
                }
            />

            {isLoading ? (
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                    <MessageSkeleton />
                    <MessageSkeleton />
                    <MessageSkeleton />
                </div>
            ) : messages.length === 0 ? (
                <EmptyState
                    icon="📭"
                    title="Mesaj Kutusu Boş"
                    description="Henüz hiç mesaj almadınız."
                />
            ) : (
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
                    {messages.map((msg) => (
                        <Card key={msg.id} style={{
                            borderLeft: msg.read ? '1px solid var(--border-color)' : '4px solid var(--color-primary-500)',
                            opacity: msg.read ? 0.8 : 1
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'flex-start' }}>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{msg.name}</h4>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{msg.email}</span>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                                    {formatDate(msg.date)}
                                </span>
                            </div>

                            <p style={{
                                margin: '1rem 0',
                                fontSize: '0.9375rem',
                                lineHeight: 1.6,
                                color: 'var(--text-primary)',
                                backgroundColor: 'var(--bg-canvas)',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)'
                            }}>
                                {msg.message}
                            </p>

                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(msg.id)}
                                    style={{ color: 'var(--color-danger)' }}
                                >
                                    Sil
                                </Button>
                                {!msg.read && (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleMarkAsRead(msg.id)}
                                    >
                                        Okundu İşaretle
                                    </Button>
                                )}
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => window.location.href = `mailto:${msg.email}`}
                                >
                                    Yanıtla
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
