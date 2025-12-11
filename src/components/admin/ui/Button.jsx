import React from 'react';
import { theme } from '../../../styles/theme';

export const Button = ({
    children,
    variant = 'primary', // primary, secondary, destructive, ghost
    size = 'md', // sm, md, lg
    fullWidth = false,
    className = '',
    isLoading = false,
    disabled,
    ...props
}) => {
    const baseStyles = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-md)',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        border: '1px solid transparent',
        outline: 'none',
        gap: '0.5rem',
        opacity: (disabled || isLoading) ? 0.6 : 1,
        pointerEvents: (disabled || isLoading) ? 'none' : 'auto',
    };

    const variants = {
        primary: {
            backgroundColor: 'var(--color-primary-600)',
            color: 'white',
            border: 'none',
            boxShadow: 'var(--shadow-sm)',
        },
        secondary: {
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            borderColor: 'var(--color-neutral-300)',
        },
        destructive: {
            backgroundColor: 'var(--color-danger)',
            color: 'white',
            border: 'none',
        },
        ghost: {
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            border: 'none',
        },
    };

    const sizes = {
        sm: {
            padding: '0.25rem 0.75rem',
            fontSize: '0.875rem',
            height: '32px',
        },
        md: {
            padding: '0.5rem 1rem',
            fontSize: '0.9375rem',
            height: '40px',
        },
        lg: {
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            height: '48px',
        },
    };

    const style = {
        ...baseStyles,
        ...variants[variant],
        ...sizes[size],
        width: fullWidth ? '100%' : 'auto',
    };

    return (
        <button style={style} className={className} disabled={disabled || isLoading} {...props}>
            {isLoading && (
                <span style={{
                    width: '16px', height: '16px',
                    border: '2px solid currentColor',
                    borderRightColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    display: 'inline-block'
                }} />
            )}
            {children}
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </button>
    );
};
