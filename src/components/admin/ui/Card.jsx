import React from 'react';

export const Card = ({ children, className = '', noPadding = false, ...props }) => {
    const style = {
        backgroundColor: 'var(--bg-panel)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        padding: noPadding ? '0' : 'var(--space-6)',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        overflow: 'hidden',
    };

    return (
        <div className={`card ${className}`} style={style} {...props}>
            {children}
        </div>
    );
};
