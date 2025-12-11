import React from 'react';

export const Badge = ({ children, variant = 'neutral', className = '' }) => {
    const variants = {
        neutral: { bg: 'var(--color-neutral-100)', color: 'var(--color-neutral-700)' },
        primary: { bg: 'var(--color-primary-50)', color: 'var(--color-primary-700)' },
        success: { bg: 'var(--color-success-bg)', color: 'var(--color-success)' },
        warning: { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)' },
        danger: { bg: 'var(--color-danger-bg)', color: 'var(--color-danger)' },
        info: { bg: 'var(--color-info-bg)', color: 'var(--color-info)' },
    };

    const style = {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.25rem 0.625rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        backgroundColor: variants[variant].bg,
        color: variants[variant].color,
    };

    return (
        <span style={style} className={className}>
            {children}
        </span>
    );
};
