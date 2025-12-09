// ============================================
// LANGUAGE SWITCHER - MURAT DEMİRHAN PORTFOLYO
// TR/EN dil geçiş butonu
// ============================================

import { useLanguage } from '../../context/LanguageContext';
import './LanguageSwitcher.css';

export function LanguageSwitcher() {
    const { language, toggleLanguage, t } = useLanguage();

    return (
        <button
            className="language-switcher"
            onClick={toggleLanguage}
            aria-label={t('language.toggle')}
        >
            <span className={`language-switcher__option ${language === 'tr' ? 'active' : ''}`}>
                TR
            </span>
            <span className="language-switcher__divider">/</span>
            <span className={`language-switcher__option ${language === 'en' ? 'active' : ''}`}>
                EN
            </span>
        </button>
    );
}

export default LanguageSwitcher;
