import React, { useState } from 'react';

const SidebarItem = ({ icon, label, active, onClick, collapsed }) => {
    const baseStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        width: '100%',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius-md)',
        color: active ? 'var(--text-on-dark)' : 'var(--text-secondary)',
        backgroundColor: active ? 'var(--color-primary-600)' : 'transparent',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        fontSize: '0.9375rem',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        justifyContent: collapsed ? 'center' : 'flex-start',
    };

    // Hover effect handled via CSS class in a real app, 
    // but for inline-style simplicity we rely on 'active' or global CSS. 
    // We'll rely on a tiny class for hover if needed or just simple style.

    return (
        <button
            style={baseStyle}
            onClick={onClick}
            className={`sidebar-item ${active ? 'active' : ''}`}
            title={collapsed ? label : ''}
        >
            <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{icon}</span>
            {!collapsed && <span>{label}</span>}
        </button>
    );
};

export const Sidebar = ({
    tabs,
    activeTab,
    onSelectTab,
    onLogout,
    isMobile,
    isOpen,
    onClose
}) => {
    const sidebarStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: '280px',
        backgroundColor: 'var(--bg-sidebar)',
        color: 'var(--text-on-dark)',
        padding: 'var(--space-6)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s ease',
        zIndex: 50,
        borderRight: '1px solid var(--border-color)', // Usually dark border
        transform: isMobile && !isOpen ? 'translateX(-100%)' : 'translateX(0)',
    };

    const overlayStyle = {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 40,
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        transition: 'opacity 0.3s ease',
        display: isMobile ? 'block' : 'none',
    };

    return (
        <>
            <div style={overlayStyle} onClick={onClose} />
            <aside style={sidebarStyle} className="modern-sidebar">
                {/* Brand */}
                <div style={{ marginBottom: 'var(--space-10)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '40px', height: '40px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.25rem'
                    }}>
                        🎨
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '1.125rem', lineHeight: 1 }}>Murat Demirhan</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Admin Panel</div>
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                    {tabs.map((tab) => (
                        <SidebarItem
                            key={tab.key}
                            icon={tab.icon}
                            label={tab.label}
                            active={activeTab === tab.key}
                            onClick={() => {
                                onSelectTab(tab.key);
                                if (isMobile) onClose();
                            }}
                        />
                    ))}
                </nav>

                {/* Footer */}
                <div style={{ paddingTop: 'var(--space-6)', borderTop: '1px solid #334155' }}>
                    <SidebarItem
                        icon="🚪"
                        label="Çıkış Yap"
                        onClick={onLogout}
                    />
                </div>
            </aside>
        </>
    );
};
