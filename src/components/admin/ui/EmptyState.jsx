import React from 'react';

export const EmptyState = ({
    icon = '📂',
    title = 'Veri Bulunamadı',
    description = 'Henüz buraya eklenmiş bir içerik yok.',
    action,
    className = ''
}) => {
    const style = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--color-neutral-300)',
    };

    return (
        <div style={style} className={className}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontWeight: 600 }}>{title}</h3>
            <p style={{ margin: '0 0 1.5rem 0', maxWidth: '400px' }}>{description}</p>
            {action && <div>{action}</div>}
        </div>
    );
};
