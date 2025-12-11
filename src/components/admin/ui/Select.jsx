import React from 'react';

export const Select = ({
    label,
    error,
    helperText,
    options = [],
    placeholder = 'Seçiniz...',
    className = '',
    fullWidth = true,
    ...props
}) => {
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        width: fullWidth ? '100%' : 'auto',
        marginBottom: '1rem',
    };

    const labelStyle = {
        fontSize: '0.875rem',
        fontWeight: 500,
        color: 'var(--text-primary)',
    };

    const inputStyle = {
        display: 'block',
        width: '100%',
        padding: '0.625rem 0.875rem',
        fontSize: '0.9375rem',
        fontFamily: 'var(--font-sans)',
        color: 'var(--text-primary)',
        backgroundColor: 'var(--bg-surface)',
        border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-neutral-300)'}`,
        borderRadius: 'var(--radius-md)',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        appearance: 'none', // Remove default arrow
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
        backgroundPosition: 'right 0.5rem center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '1.5em 1.5em',
        paddingRight: '2.5rem',
    };

    const handleFocus = (e) => {
        e.target.style.borderColor = error ? 'var(--color-danger)' : 'var(--color-primary-500)';
        e.target.style.boxShadow = `0 0 0 3px ${error ? 'var(--color-danger-bg)' : 'var(--color-primary-100)'}`;
    };

    const handleBlur = (e) => {
        e.target.style.borderColor = error ? 'var(--color-danger)' : 'var(--color-neutral-300)';
        e.target.style.boxShadow = 'none';
    };

    return (
        <div style={containerStyle} className={className}>
            {label && <label style={labelStyle}>{label}</label>}
            <select
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
                {...props}
            >
                <option value="" disabled>{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <span style={{ fontSize: '0.75rem', color: 'var(--color-danger)' }}>{error}</span>}
            {helperText && !error && <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{helperText}</span>}
        </div>
    );
};
