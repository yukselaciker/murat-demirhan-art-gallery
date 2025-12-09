/* ============================================
   GALERİ VERİSİ
   Buraya yeni eserler eklenecek - sadece bu dosyaya obje eklemek yeterli
   ============================================ */

export const artworks = [
    {
        id: 1,
        title: "Sessiz Sokaklar",
        year: 2024,
        technique: "Tuval üzerine yağlı boya",
        size: "80x120 cm",
        category: "soyut",
        tags: ["şehir", "yalnızlık", "mavi", "gri"],
        description: "Şehrin gürültüsünden uzak, hafızanın derinliklerinde saklı kalan sessiz anları betimleyen soyut bir kompozisyon. Mavi ve gri tonların hakimiyetinde, izleyiciyi içsel bir yolculuğa davet ediyor.",
        status: "Özel Koleksiyon",
        // Buraya gerçek görsel yolu eklenecek
        // image: "images/artworks/sessiz-sokaklar.jpg"
        imagePlaceholder: true
    },
    {
        id: 2,
        title: "Hafıza Fragmanları",
        year: 2023,
        technique: "Tuval üzerine yağlı boya",
        size: "100x100 cm",
        category: "soyut",
        tags: ["hafıza", "geçmiş", "katman", "doku"],
        description: "Geçmişin parçalı izlerini bir araya getiren, hafıza ve unutuş arasındaki gerilimi sorgulayan bir çalışma. Katmanlı doku ve renk geçişleri, anıların silikleşen doğasını yansıtıyor.",
        status: "Satılık",
        imagePlaceholder: true
    },
    {
        id: 3,
        title: "İsimsiz Portre I",
        year: 2023,
        technique: "Tuval üzerine yağlı boya",
        size: "60x80 cm",
        category: "figuratif",
        tags: ["portre", "kimlik", "yüz", "ifade"],
        description: "Kimliksizleşen modern bireyin portresini sorgulayan figüratif bir çalışma. Yüz hatları belirsizleşirken, duygusal ifade ön plana çıkıyor.",
        status: "Özel Koleksiyon",
        imagePlaceholder: true
    },
    {
        id: 4,
        title: "Boğaz'da Şafak",
        year: 2022,
        technique: "Tuval üzerine yağlı boya",
        size: "120x80 cm",
        category: "peyzaj",
        tags: ["istanbul", "boğaz", "şafak", "deniz"],
        description: "İstanbul Boğazı'nın şafak vaktindeki büyüleyici atmosferini yakalayan bir peyzaj çalışması. Sıcak ve soğuk renklerin harmonisi, şehrin mistik havasını yansıtıyor.",
        status: "Satılık",
        imagePlaceholder: true
    },
    {
        id: 5,
        title: "Çocukluk Bahçesi",
        year: 2022,
        technique: "Tuval üzerine yağlı boya",
        size: "90x70 cm",
        category: "soyut",
        tags: ["çocukluk", "anı", "renk", "enerji"],
        description: "Çocukluk anılarının renkli ve kaotik doğasını yansıtan soyut bir kompozisyon. Canlı renkler ve organik formlar, masumiyetin enerjisini ifade ediyor.",
        status: "Müze Koleksiyonu",
        imagePlaceholder: true
    },
    {
        id: 6,
        title: "Kalabalıkta Yalnız",
        year: 2021,
        technique: "Tuval üzerine yağlı boya",
        size: "100x150 cm",
        category: "figuratif",
        tags: ["kalabalık", "yalnızlık", "şehir", "modern"],
        description: "Modern kent yaşamının yalnızlaştırıcı etkisini sorgulayan figüratif bir çalışma. Bulanık figürler arasından beliren tek net yüz, izleyiciyle doğrudan iletişim kuruyor.",
        status: "Özel Koleksiyon",
        imagePlaceholder: true
    },
    {
        id: 7,
        title: "Anadolu Stebi",
        year: 2021,
        technique: "Tuval üzerine yağlı boya",
        size: "140x100 cm",
        category: "peyzaj",
        tags: ["anadolu", "step", "doğa", "sonsuzluk"],
        description: "Anadolu'nun uçsuz bucaksız ovalarını betimleyen geniş format bir peyzaj. Toprak tonları ve minimalist kompozisyon, doğanın sonsuzluğunu hissettiriyor.",
        status: "Satılık",
        imagePlaceholder: true
    },
    {
        id: 8,
        title: "Gece Penceresi",
        year: 2020,
        technique: "Tuval üzerine yağlı boya",
        size: "70x90 cm",
        category: "figuratif",
        tags: ["gece", "pencere", "yalnızlık", "düşünce"],
        description: "Bir pencereden dışarı bakan figürün siluetini merkeze alan, içe dönük bir atmosfer yaratıyor. Işık-gölge kontrastı, yalnızlık ve düşünce halini güçlendiriyor.",
        status: "Özel Koleksiyon",
        imagePlaceholder: true
    },
    {
        id: 9,
        title: "Kapadokya Işıkları",
        year: 2020,
        technique: "Tuval üzerine yağlı boya",
        size: "100x80 cm",
        category: "peyzaj",
        tags: ["kapadokya", "peri bacaları", "ışık", "gün batımı"],
        description: "Kapadokya'nın eşsiz jeolojik formasyonlarını gün batımı ışığında betimleyen etkileyici bir peyzaj. Turuncu ve mor tonların dansı.",
        status: "Satılık",
        imagePlaceholder: true
    },
    {
        id: 10,
        title: "İç Monolog",
        year: 2019,
        technique: "Tuval üzerine yağlı boya",
        size: "80x80 cm",
        category: "soyut",
        tags: ["iç ses", "düşünce", "derinlik", "soyut"],
        description: "İç dünyanın karmaşık yapısını soyut formlarla ifade eden meditasyonel bir çalışma. Derin mavi ve mor tonlar huzur ve derinlik hissi veriyor.",
        status: "Özel Koleksiyon",
        imagePlaceholder: true
    }
];

// ============================================
// SERGİ VERİSİ
// Buraya yeni sergiler eklenecek
// ============================================
export const exhibitions = [
    {
        year: "2024",
        title: "Hafızanın Renkleri",
        location: "İstanbul",
        venue: "Pera Müzesi",
        description: "Kişisel sergi - 35 eserden oluşan kapsamlı retrospektif",
        type: "Kişisel Sergi"
    },
    {
        year: "2023",
        title: "Çağdaş Türk Sanatı",
        location: "Berlin",
        venue: "Galerie Kunst",
        description: "Uluslararası karma sergi - 5 eser ile katılım",
        type: "Karma Sergi"
    },
    {
        year: "2022",
        title: "Şehir ve Yalnızlık",
        location: "Ankara",
        venue: "CerModern",
        description: "Tematik grup sergisi - 8 eser ile katılım",
        type: "Grup Sergisi"
    },
    {
        year: "2021",
        title: "Genç Ustalar",
        location: "İzmir",
        venue: "İzmir Sanat Galerisi",
        description: "Davetli sanatçı sergisi - 12 eser ile katılım",
        type: "Davetli Sergi"
    },
    {
        year: "2020",
        title: "İç Sesler",
        location: "İstanbul",
        venue: "Arter",
        description: "Kişisel sergi - 20 yeni eser",
        type: "Kişisel Sergi"
    },
    {
        year: "2019",
        title: "Contemporary Istanbul",
        location: "İstanbul",
        venue: "Lütfi Kırdar Kongre Merkezi",
        description: "Uluslararası sanat fuarı - Galeri temsili",
        type: "Sanat Fuarı"
    }
];
