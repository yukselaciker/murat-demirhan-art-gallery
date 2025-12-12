// ============================================
// HEADER COMPONENT - MURAT DEMİRHAN PORTFOLYO
// Sticky navigation header
// ============================================

import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useScrollSpy } from '../../hooks/useScrollSpy';
// import ThemeToggle from '../ui/ThemeToggle';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import './Header.css';

const SECTION_IDS = ['hero', 'hakkinda', 'galeri', 'updates', 'sergiler', 'iletisim'];

export function Header() {
    const { t } = useLanguage();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const activeSection = useScrollSpy(SECTION_IDS);

    // Scroll durumunu izle
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Mobil menü açıkken scroll'u kilitle
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    }, [isMobileMenuOpen]);

    const navItems = [
        { id: 'hero', label: t('nav.home') },
        { id: 'hakkinda', label: t('nav.about') },
        { id: 'galeri', label: t('nav.gallery') },
        { id: 'updates', label: t('nav.updates') || 'Güncellemeler' },
        { id: 'sergiler', label: t('nav.exhibitions') },
        { id: 'iletisim', label: t('nav.contact') }
    ];

    const handleNavClick = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const headerHeight = 80;
            const targetPosition = element.offsetTop - headerHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
        setIsMobileMenuOpen(false);
    };

    return (
        <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
            <div className="container">
                <div className="header__content">
                    {/* Logo */}
                    <a
                        href="#hero"
                        className="header__logo"
                        onClick={(e) => handleNavClick(e, 'hero')}
                    >
                        Murat Demirhan
                    </a>

                    {/* Navigasyon */}
                    <nav className={`nav ${isMobileMenuOpen ? 'nav--open' : ''}`}>
                        <ul className="nav__list">
                            {navItems.map(item => (
                                <li key={item.id}>
                                    <a
                                        href={`#${item.id}`}
                                        className={`nav__link ${activeSection === item.id ? 'nav__link--active' : ''}`}
                                        onClick={(e) => handleNavClick(e, item.id)}
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Sağ Taraf: Dil, Menü Butonu */}
                    <div className="header__right">
                        <LanguageSwitcher />
                        {/* ThemeToggle removed */}

                        {/* Mobil Menü Butonu */}
                        <button
                            className={`nav-toggle ${isMobileMenuOpen ? 'nav-toggle--open' : ''}`}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Menüyü aç/kapat"
                            aria-expanded={isMobileMenuOpen}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
