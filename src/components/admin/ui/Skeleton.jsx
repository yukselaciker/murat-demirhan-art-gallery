import React from 'react';

export const Skeleton = ({ width, height, borderRadius = '4px', className = '' }) => {
    const style = {
        width,
        height,
        borderRadius,
        backgroundColor: 'var(--color-neutral-200)',
        animation: 'pulse 1.5s ease-in-out infinite',
        display: 'inline-block',
    };

    return (
        <>
            <span style={style} className={className} />
            <style>{`
            @keyframes pulse {
                0% { opacity: 0.6; }
                50% { opacity: 1; }
                100% { opacity: 0.6; }
            }
        `}</style>
        </>
    );
};

export const SkeletonList = ({ count = 3, height = '60px' }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Array.from({ length: count }).map((_, i) => (
                <Skeleton key={i} width="100%" height={height} borderRadius="var(--radius-lg)" />
            ))}
        </div>
    );
};
