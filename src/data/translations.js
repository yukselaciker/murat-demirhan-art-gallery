// ============================================
// ÇEVİRİLER - MURAT DEMİRHAN PORTFOLYO
// TR/EN dil desteği için sözlük yapısı
// ============================================

export const translations = {
    tr: {
        // Navigasyon
        nav: {
            home: 'Ana Sayfa',
            about: 'Hakkında',
            gallery: 'Eserler',
            updates: 'Güncellemeler',
            exhibitions: 'Sergiler',
            contact: 'İletişim'
        },

        // Hero Bölümü
        hero: {
            subtitle: 'Çağdaş Sanat',
            title: 'Murat Demirhan',
            description: 'Renklerle hafızayı yeniden kuran, geçmişin izlerini tuval üzerinde çağdaş bir dille yorumlayan ressam.',
            cta: {
                primary: 'Eserleri Keşfet',
                secondary: 'Sanatçı Hakkında'
            }
        },

        // Hakkında Bölümü
        about: {
            title: 'Murat Demirhan Kimdir?',
            bio: [
                '1978 yılında İstanbul\'da doğan Murat Demirhan, çocukluk yıllarından itibaren renklerin ve formların büyüsüne kapılmış, sanatı bir ifade aracı olarak benimsemiştir. Mimar Sinan Güzel Sanatlar Üniversitesi Resim Bölümü\'nden mezun olduktan sonra, Avrupa\'da çeşitli atölye çalışmalarına katılarak tekniğini ve sanat anlayışını geliştirmiştir.',
                'Eserlerinde şehir yalnızlığı, hafıza katmanları ve çocukluk anıları gibi temaları işleyen Demirhan, soyut formlarla figüratif öğeleri harmanlayan özgün bir dil oluşturmuştur. Tuval üzerine yağlı boya tekniğini ustaca kullanan sanatçı, renk geçişleri ve doku çalışmalarıyla izleyiciyi duygusal bir yolculuğa davet eder.',
                'Ulusal ve uluslararası birçok sergi ve sanat fuarına katılan Demirhan\'ın eserleri, özel koleksiyonlarda ve müzelerde yer almaktadır. Sanatçı, İstanbul\'daki atölyesinde yaratıcı çalışmalarına devam etmektedir.'
            ],
            artistNote: '"Her fırça darbesi, geçmişe açılan bir pencere... Ben sadece hatırlamanın renklerini arıyorum."',
            info: {
                birth: { label: 'Doğum', value: '1978, İstanbul' },
                education: { label: 'Eğitim', value: 'MSGSÜ Resim' },
                technique: { label: 'Teknik', value: 'Yağlı Boya' }
            }
        },

        // Galeri Bölümü
        gallery: {
            title: 'Eserler',
            subtitle: 'Koleksiyondan seçme çalışmalar',
            searchPlaceholder: 'Eser adı veya etiket ara...',
            filters: {
                all: 'Hepsi',
                soyut: 'Soyut',
                figuratif: 'Figüratif',
                peyzaj: 'Peyzaj'
            },
            viewDetails: 'Detayları Gör',
            noResults: 'Aramanızla eşleşen eser bulunamadı.',
            status: {
                available: 'Satılık',
                reserved: 'Rezerve',
                sold: 'Satıldı',
                collection: 'Özel Koleksiyon',
                museum: 'Müze Koleksiyonu'
            }
        },

        // Lightbox
        lightbox: {
            year: 'Yıl',
            technique: 'Teknik',
            size: 'Ölçüler',
            prev: 'Önceki',
            next: 'Sonraki',
            close: 'Kapat'
        },

        // Sergiler Bölümü
        exhibitions: {
            title: 'Sergiler ve Etkinlikler',
            subtitle: 'Geçmiş ve yaklaşan sergiler',
            types: {
                solo: 'Kişisel Sergi',
                group: 'Karma Sergi',
                fair: 'Sanat Fuarı',
                invited: 'Davetli Sergi'
            }
        },

        // İletişim Bölümü
        contact: {
            title: 'İletişim',
            description: 'Eserler hakkında bilgi almak, sergi davetleri veya iş birlikleri için aşağıdaki formu doldurabilirsiniz. En kısa sürede size dönüş yapılacaktır.',
            form: {
                name: 'Ad Soyad',
                namePlaceholder: 'Adınız Soyadınız',
                email: 'E-posta',
                emailPlaceholder: 'ornek@email.com',
                subject: 'Konu',
                subjectPlaceholder: 'Mesajınızın konusu',
                message: 'Mesaj',
                messagePlaceholder: 'Mesajınızı buraya yazınız...',
                submit: 'Gönder',
                sending: 'Gönderiliyor...'
            },
            errors: {
                nameRequired: 'Lütfen adınızı giriniz.',
                emailRequired: 'Lütfen geçerli bir e-posta adresi giriniz.',
                messageRequired: 'Lütfen mesajınızı giriniz.'
            },
            success: 'Mesajınız başarıyla alındı. En kısa sürede size dönüş yapılacaktır.'
        },

        // Footer
        footer: {
            copyright: '© 2025 Murat Demirhan. Tüm hakları saklıdır.',
            privacy: 'Gizlilik Politikası',
            terms: 'Kullanım Şartları'
        },

        // Tema
        theme: {
            light: 'Açık Tema',
            dark: 'Koyu Tema',
            toggle: 'Tema değiştir'
        },

        // Dil
        language: {
            tr: 'Türkçe',
            en: 'English',
            toggle: 'Dil değiştir'
        }
    },

    en: {
        // Navigation
        nav: {
            home: 'Home',
            about: 'About',
            gallery: 'Works',
            updates: 'Updates',
            exhibitions: 'Exhibitions',
            contact: 'Contact'
        },

        // Hero Section
        hero: {
            subtitle: 'Contemporary Art',
            title: 'Murat Demirhan',
            description: 'A painter who reconstructs memory through colors, interpreting traces of the past on canvas with a contemporary language.',
            cta: {
                primary: 'Explore Works',
                secondary: 'About the Artist'
            }
        },

        // About Section
        about: {
            title: 'Who is Murat Demirhan?',
            bio: [
                'Born in Istanbul in 1978, Murat Demirhan was captivated by the magic of colors and forms from an early age, embracing art as a means of expression. After graduating from the Painting Department at Mimar Sinan Fine Arts University, he developed his technique and artistic vision through various workshop studies in Europe.',
                'Exploring themes such as urban loneliness, layers of memory, and childhood memories in his works, Demirhan has created an original language that blends abstract forms with figurative elements. Masterfully using the oil on canvas technique, the artist invites viewers on an emotional journey through color transitions and texture work.',
                'Demirhan\'s works, which have participated in numerous national and international exhibitions and art fairs, are featured in private collections and museums. The artist continues his creative work in his Istanbul studio.'
            ],
            artistNote: '"Each brushstroke is a window to the past... I am simply searching for the colors of remembrance."',
            info: {
                birth: { label: 'Born', value: '1978, Istanbul' },
                education: { label: 'Education', value: 'MSGSÜ Painting' },
                technique: { label: 'Technique', value: 'Oil on Canvas' }
            }
        },

        // Gallery Section
        gallery: {
            title: 'Works',
            subtitle: 'Selected works from the collection',
            searchPlaceholder: 'Search by title or tag...',
            filters: {
                all: 'All',
                soyut: 'Abstract',
                figuratif: 'Figurative',
                peyzaj: 'Landscape'
            },
            viewDetails: 'View Details',
            noResults: 'No works found matching your search.',
            status: {
                available: 'For Sale',
                reserved: 'Reserved',
                sold: 'Sold',
                collection: 'Private Collection',
                museum: 'Museum Collection'
            }
        },

        // Lightbox
        lightbox: {
            year: 'Year',
            technique: 'Technique',
            size: 'Dimensions',
            prev: 'Previous',
            next: 'Next',
            close: 'Close'
        },

        // Exhibitions Section
        exhibitions: {
            title: 'Exhibitions and Events',
            subtitle: 'Past and upcoming exhibitions',
            types: {
                solo: 'Solo Exhibition',
                group: 'Group Exhibition',
                fair: 'Art Fair',
                invited: 'Invited Exhibition'
            }
        },

        // Contact Section
        contact: {
            title: 'Contact',
            description: 'For information about artworks, exhibition invitations, or collaborations, please fill out the form below. We will get back to you as soon as possible.',
            form: {
                name: 'Full Name',
                namePlaceholder: 'Your Full Name',
                email: 'Email',
                emailPlaceholder: 'example@email.com',
                subject: 'Subject',
                subjectPlaceholder: 'Subject of your message',
                message: 'Message',
                messagePlaceholder: 'Write your message here...',
                submit: 'Send',
                sending: 'Sending...'
            },
            errors: {
                nameRequired: 'Please enter your name.',
                emailRequired: 'Please enter a valid email address.',
                messageRequired: 'Please enter your message.'
            },
            success: 'Your message has been received. We will get back to you shortly.'
        },

        // Footer
        footer: {
            copyright: '© 2025 Murat Demirhan. All rights reserved.',
            privacy: 'Privacy Policy',
            terms: 'Terms of Use'
        },

        // Theme
        theme: {
            light: 'Light Theme',
            dark: 'Dark Theme',
            toggle: 'Toggle theme'
        },

        // Language
        language: {
            tr: 'Türkçe',
            en: 'English',
            toggle: 'Toggle language'
        }
    }
};

export default translations;
