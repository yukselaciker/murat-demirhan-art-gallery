// ============================================
// BUTTON COMPONENT - MURAT DEMİRHAN PORTFOLYO
// Yeniden kullanılabilir buton bileşeni
// ============================================

import './Button.css';

export function Button({
    children,
    variant = 'primary', // primary, secondary, ghost
    size = 'md', // sm, md, lg
    href,
    onClick,
    disabled = false,
    type = 'button',
    className = '',
    icon,
    ...props
}) {
    const classes = `btn btn--${variant} btn--${size} ${className}`.trim();

    // Link olarak render et
    if (href) {
        return (
            <a href={href} className={classes} {...props}>
                {children}
                {icon && <span className="btn__icon">{icon}</span>}
            </a>
        );
    }

    // Buton olarak render et
    return (
        <button
            type={type}
            className={classes}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
            {icon && <span className="btn__icon">{icon}</span>}
        </button>
    );
}

export default Button;
