import React from 'react';

export const FormGrid = ({ children, columns = 2, gap = 4, className = '' }) => {
    const style = {
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))`, // Responsive auto-fit
        gap: `var(--space-${gap})`,
        marginBottom: 'var(--space-6)',
    };

    return (
        <div style={style} className={className}>
            {children}
        </div>
    );
};
