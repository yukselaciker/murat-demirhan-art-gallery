import React from 'react';

export const PageHeader = ({ title, subtitle, actions }) => {
    const headerStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        marginBottom: 'var(--space-8)',
    };

    const topRowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
    };

    const titleStyle = {
        fontSize: '1.875rem',
        fontWeight: 700,
        color: 'var(--text-primary)',
        margin: 0,
        letterSpacing: '-0.025em',
    };

    const subtitleStyle = {
        fontSize: '0.9375rem',
        color: 'var(--text-secondary)',
        margin: 0,
    };

    return (
        <div style={headerStyle}>
            <div style={topRowStyle}>
                <div>
                    <h1 style={titleStyle}>{title}</h1>
                    {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
                </div>
                {actions && <div>{actions}</div>}
            </div>
        </div>
    );
};
