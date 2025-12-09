// ============================================
// CONTACT SECTION - MURAT DEMİRHAN PORTFOLYO
// İletişim formu
// ============================================

import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import Button from '../ui/Button';
import './Contact.css';

export function Contact() {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = t('contact.errors.nameRequired');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim() || !emailRegex.test(formData.email)) {
            newErrors.email = t('contact.errors.emailRequired');
        }

        if (!formData.message.trim()) {
            newErrors.message = t('contact.errors.messageRequired');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        // ============================================
        // Backend entegrasyonu burada yapılacak
        // Örnek: Formspree, EmailJS veya kendi API'niz
        //
        // await fetch('https://formspree.io/f/xxxxx', {
        //   method: 'POST',
        //   body: JSON.stringify(formData),
        //   headers: { 'Content-Type': 'application/json' }
        // });
        // ============================================

        // Simüle edilmiş gönderim
        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsSubmitting(false);
        setIsSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });

        // 5 saniye sonra başarı mesajını gizle
        setTimeout(() => setIsSuccess(false), 5000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Hata mesajını temizle
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    return (
        <section className="contact" id="iletisim">
            <div className="container">
                <div className="contact__content">
                    {/* Sol Taraf: Bilgi */}
                    <div className="contact__info slide-in-left">
                        <h2 className="section-title">{t('contact.title')}</h2>
                        <p className="contact__description">{t('contact.description')}</p>

                        <div className="contact__details">
                            <div className="contact__detail-item">
                                <svg className="contact__detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="contact__detail-text">info@muratdemirhan.com</span>
                            </div>
                            <div className="contact__detail-item">
                                <svg className="contact__detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="contact__detail-text">İstanbul, Türkiye</span>
                            </div>
                        </div>
                    </div>

                    {/* Sağ Taraf: Form */}
                    <div className="contact__form-wrapper slide-in-right">
                        <form className="contact__form" onSubmit={handleSubmit} noValidate>
                            <div className={`form__group ${errors.name ? 'form__group--error' : ''}`}>
                                <label htmlFor="name" className="form__label">{t('contact.form.name')}</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="form__input"
                                    placeholder={t('contact.form.namePlaceholder')}
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                                {errors.name && <span className="form__error">{errors.name}</span>}
                            </div>

                            <div className={`form__group ${errors.email ? 'form__group--error' : ''}`}>
                                <label htmlFor="email" className="form__label">{t('contact.form.email')}</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form__input"
                                    placeholder={t('contact.form.emailPlaceholder')}
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {errors.email && <span className="form__error">{errors.email}</span>}
                            </div>

                            <div className="form__group">
                                <label htmlFor="subject" className="form__label">{t('contact.form.subject')}</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    className="form__input"
                                    placeholder={t('contact.form.subjectPlaceholder')}
                                    value={formData.subject}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={`form__group ${errors.message ? 'form__group--error' : ''}`}>
                                <label htmlFor="message" className="form__label">{t('contact.form.message')}</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    className="form__textarea"
                                    placeholder={t('contact.form.messagePlaceholder')}
                                    value={formData.message}
                                    onChange={handleChange}
                                />
                                {errors.message && <span className="form__error">{errors.message}</span>}
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                className="form__submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? t('contact.form.sending') : t('contact.form.submit')}
                                {!isSubmitting && (
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                )}
                            </Button>

                            {/* Başarı Mesajı */}
                            {isSuccess && (
                                <div className="form__success">
                                    <p>✓ {t('contact.success')}</p>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Contact;
