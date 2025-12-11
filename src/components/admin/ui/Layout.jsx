import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';

export const Layout = ({ children, tabs, activeTab, onSelectTab, onLogout }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const mainStyle = {
        marginLeft: isMobile ? 0 : '280px',
        minHeight: '100vh',
        padding: isMobile ? 'var(--space-4)' : 'var(--space-8)',
        transition: 'margin-left 0.3s ease',
        paddingTop: isMobile ? '80px' : 'var(--space-8)', // Space for mobile header
    };

    const mobileHeaderStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-color)',
        display: isMobile ? 'flex' : 'none',
        alignItems: 'center',
        padding: '0 var(--space-4)',
        zIndex: 30,
        justifyContent: 'space-between',
    };

    return (
        <div className="admin-layout">
            {/* Mobile Header */}
            <header style={mobileHeaderStyle}>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                >
                    ☰
                </button>
                <span style={{ fontWeight: 700 }}>Murat Demirhan</span>
                <div style={{ width: '24px' }} /> {/* Balance */}
            </header>

            <Sidebar
                tabs={tabs}
                activeTab={activeTab}
                onSelectTab={onSelectTab}
                onLogout={onLogout}
                isMobile={isMobile}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main style={mainStyle}>
                {children}
            </main>
        </div>
    );
};
