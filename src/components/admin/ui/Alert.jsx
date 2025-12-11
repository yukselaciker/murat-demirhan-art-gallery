import React from 'react';

export const Alert = ({ variant = 'info', title, children, className = '' }) => {
    const variants = {
        info: {
            bg: 'var(--color-info-bg)',
            text: 'var(--color-info)',
            border: 'var(--color-info)',
            icon: 'ℹ️'
        },
        warning: {
            bg: 'var(--color-warning-bg)',
            text: 'var(--color-warning)',
            border: 'var(--color-warning)',
            icon: '⚠️'
        },
        danger: {
            bg: 'var(--color-danger-bg)',
            text: 'var(--color-danger)',
            border: 'var(--color-danger)',
            icon: '🚫'
        },
        success: {
            bg: 'var(--color-success-bg)',
            text: 'var(--color-success)',
            border: 'var(--color-success)',
            icon: '✅'
        }
    };

    const current = variants[variant];

    const style = {
        backgroundColor: current.bg,
        color: 'var(--text-primary)',
        border: `1px solid ${current.border}40`, // Low opacity border
        borderRadius: 'var(--radius-md)',
        padding: '1rem',
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'flex-start',
    };

    return (
        <div style={style} className={className} role="alert">
            <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{current.icon}</span>
            <div>
                {title && <h5 style={{ margin: '0 0 0.25rem 0', fontWeight: 600, color: current.text }}>{title}</h5>}
                <div style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>{children}</div>
            </div>
        </div>
    );
};
