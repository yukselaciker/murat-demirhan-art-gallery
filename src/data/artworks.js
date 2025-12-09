// ============================================
// ESER VERİLERİ - MURAT DEMİRHAN PORTFOLYO
// Galeri için eser bilgileri
// ============================================

// Base path'i ortama göre (file://, alt dizin, prod) doğru hesaplamak için yardımcı
const imagePath = (fileName) => `${import.meta.env.BASE_URL}images/${fileName}`;

export const artworks = [
    // ===== GERÇEK ESERLER =====
    {
        id: 1,
        title: 'Bisikletli Çocuk',
        titleEn: 'Child with Bicycle',
        year: 2024,
        technique: 'Tuval üzerine yağlı boya',
        techniqueEn: 'Oil on canvas',
        size: '60x80 cm', // Tahmini boyut
        category: 'figuratif',
        tags: ['çocuk', 'bisiklet', 'deniz', 'duvar', 'masumiyet'],
        tagsEn: ['child', 'bicycle', 'sea', 'wall', 'innocence'],
        description: 'Deniz kenarındaki taş duvarın önünde, mavi bisikletiyle duran ve parmağıyla ufku işaret eden bir çocuk. Çocuğun meraklı bakışları ve işaret ettiği yön, izleyiciyi de o yöne bakmaya davet ediyor. Arka plandaki sakin deniz ve gökyüzü, anın huzurunu yansıtıyor.',
        descriptionEn: 'A child standing with his blue bicycle in front of a stone wall by the sea, pointing at the horizon with his finger. The child\'s curious gaze and pointing gesture invite the viewer to look in that direction too. The calm sea and sky in the background reflect the serenity of the moment.',
        status: 'collection',
        image: imagePath('bisikletli-cocuk.jpg'),
        isForSale: false,
        price: null
    },
    {
        id: 2,
        title: 'Tandır Başında',
        titleEn: 'At the Tandoor',
        year: 2023,
        technique: 'Tuval üzerine yağlı boya',
        techniqueEn: 'Oil on canvas',
        size: '100x70 cm', // Tahmini boyut
        category: 'figuratif',
        tags: ['gelenek', 'anadolu', 'ekmek', 'köy', 'kadın', 'ateş'],
        tagsEn: ['tradition', 'anatolia', 'bread', 'village', 'woman', 'fire'],
        description: 'Karanlık bir mekanda tandırın sıcak ışığıyla aydınlanan, ekmek pişiren Anadolu kadınları. Ateşin yüzlerine vuran kızıllığı ve mekanın atmosferi, geleneksel yaşamın zorluğunu ve güzelliğini birlikte sunuyor. Sol taraftaki figürün dinamik duruşu ile sağdaki figürün sakin bekleyişi dengeli bir kompozisyon oluşturuyor.',
        descriptionEn: 'Anatolian women baking bread, illuminated by the warm light of the tandoor in a dark space. The redness of the fire reflecting on their faces and the atmosphere of the space present both the difficulty and beauty of traditional life together. The dynamic posture of the figure on the left and the calm waiting of the figure on the right create a balanced composition.',
        status: 'available',
        image: imagePath('tandir-basinda.jpg'),
        isForSale: true,
        price: 'Soru üzerine'
    },
    {
        id: 3,
        title: 'Misket Oynayan Çocuklar',
        titleEn: 'Children Playing Marbles',
        year: 2024,
        technique: 'Tuval üzerine yağlı boya',
        techniqueEn: 'Oil on canvas',
        size: '80x100 cm', // Tahmini boyut
        category: 'figuratif',
        tags: ['çocuk', 'oyun', 'misket', 'sokak', 'arkadaşlık', 'renkler'],
        tagsEn: ['child', 'game', 'marble', 'street', 'friendship', 'colors'],
        description: 'Sokakta yere çömelmiş, dikkatle misket oynayan üç çocuk. Öndeki renkli misketlerin detaylı işçiliği ve çocukların yüzlerindeki odaklanma ifadesi, oyunun ciddiyetini ve neşesini yansıtıyor. Turkuaz kapı ve duvar dokusu, sahneye canlılık katıyor.',
        descriptionEn: 'Three children squatting on the street, playing marbles carefully. The detailed craftsmanship of the colorful marbles in the front and the focused expressions on the children\'s faces reflect the seriousness and joy of the game. The turquoise door and wall texture add vibrancy to the scene.',
        status: 'collection',
        image: imagePath('misket-oynayan.jpg'), // Düzeltme: dosya adı
        isForSale: false,
        price: null
    },
    {
        id: 4,
        title: 'Efe\'nin Duruşu',
        titleEn: 'Stance of the Efe',
        year: 2023,
        technique: 'Tuval üzerine yağlı boya',
        techniqueEn: 'Oil on canvas',
        size: '70x90 cm', // Tahmini boyut
        category: 'figuratif',
        tags: ['efe', 'zeybek', 'gelenek', 'yiğit', 'kostüm', 'kültür'],
        tagsEn: ['efe', 'zeybek', 'tradition', 'brave', 'costume', 'culture'],
        description: 'Geleneksel Efe kıyafetleri içinde, elinde tüfeğiyle mağrur bir duruş sergileyen figür. Empresyonist fırça darbeleriyle oluşturulan renkli arka plan, figürün ciddiyetiyle tezat oluşturarak modern bir yorum katıyor. Başlıktaki çiçek detayları ve işlemeler özenle betimlenmiş.',
        descriptionEn: 'A figure displaying a proud stance with his rifle in traditional Efe attire. The colorful background created with impressionist brushstrokes contrasts with the seriousness of the figure, adding a modern interpretation. The flower details and embroidery on the headgear are carefully depicted.',
        status: 'available',
        image: imagePath('efe-zeybek.jpg'),
        isForSale: true,
        price: 'Soru üzerine'
    },
    {
        id: 5,
        title: 'Mavi Kuşlar',
        titleEn: 'Blue Birds',
        year: 2024,
        technique: 'Tuval üzerine yağlı boya',
        techniqueEn: 'Oil on canvas',
        size: '50x60 cm', // Tahmini boyut
        category: 'peyzaj', // Doğa/Peyzaj kategorisine uygun
        tags: ['kuş', 'doğa', 'bahar', 'çiçek', 'mavi', 'ağaç'],
        tagsEn: ['bird', 'nature', 'spring', 'flower', 'blue', 'tree'],
        description: 'Çiçek açmış bir ağacın dallarına tünemiş iki mavi kuş. Canlı mavi tüyleri ve beyaz çiçeklerin uyumu, baharın gelişini müjdeliyor. Arka plandaki bulanık mavi tonlar, kuşları ön plana çıkarıyor ve rüya gibi bir atmosfer yaratıyor.',
        descriptionEn: 'Two blue birds perched on the branches of a blossoming tree. The harmony of their vibrant blue feathers and white flowers heralds the arrival of spring. The blurred blue tones in the background bring the birds to the forefront and create a dreamlike atmosphere.',
        status: 'available',
        image: imagePath('mavi-kuslar.jpg'),
        isForSale: true,
        price: 'Soru üzerine'
    },
    {
        id: 6,
        title: 'Atlılar',
        titleEn: 'The Cavalry',
        year: 2023,
        technique: 'Tuval üzerine yağlı boya',
        techniqueEn: 'Oil on canvas',
        size: '80x100 cm', // Tahmini boyut
        category: 'figuratif',
        tags: ['at', 'savaş', 'hareket', 'hız', 'tarih', 'figür'],
        tagsEn: ['horse', 'war', 'motion', 'speed', 'history', 'figure'],
        description: 'Dörtnala koşan atların ve üzerindeki figürlerin dinamik ve kaotik hareketini yansıtan bir kompozisyon. Figürlerin rüzgarla savrulan kıyafetleri ve atların kas yapıları, sahnenin enerjisini izleyiciye aktarıyor. Tarihsel ve destansı bir atmosfer hakim.',
        descriptionEn: 'A composition reflecting the dynamic and chaotic movement of galloping horses and the figures upon them. The wind-blown clothes of the figures and the muscular structures of the horses convey the energy of the scene to the viewer. A historical and epic atmosphere prevails.',
        status: 'collection',
        image: imagePath('atlilar.jpg'),
        isForSale: false,
        price: null
    },
    {
        id: 7,
        title: 'Çoban ve Sürü',
        titleEn: 'Shepherd and Flock',
        year: 2024,
        technique: 'Tuval üzerine yağlı boya',
        techniqueEn: 'Oil on canvas',
        size: '70x90 cm', // Tahmini boyut
        category: 'figuratif', // 'Pastoral' yerine genel kategori
        tags: ['çoban', 'koyun', 'mavi', 'doğa', 'huzur', 'Anadolu'],
        tagsEn: ['shepherd', 'sheep', 'blue', 'nature', 'serenity', 'Anatolia'],
        description: 'Mavi tonların hakim olduğu, huzurlu bir kompozisyon. Sürüsünün önünde duran çoban figürü, doğayla olan uyumu simgeliyor. Koyunların yün dokusu ve çobanın kıyafeti, empresyonist bir stille, ışık ve gölge oyunlarıyla betimlenmiş.',
        descriptionEn: 'A peaceful composition dominated by blue tones. The shepherd figure standing in front of his flock symbolizes harmony with nature. The texture of the sheep\'s wool and the shepherd\'s attire are depicted in an impressionist style with plays of light and shadow.',
        status: 'available',
        image: imagePath('coban.jpg'),
        isForSale: true,
        price: 'Soru üzerine'
    },
    {
        id: 8,
        title: 'İzmir\'in Kurtuluşu',
        titleEn: 'Liberation of Izmir',
        year: 2023,
        technique: 'Tuval üzerine yağlı boya',
        techniqueEn: 'Oil on canvas',
        size: '100x120 cm', // Tahmini boyut
        category: 'tarihsel', // Yeni kategori
        tags: ['İzmir', 'Atatürk', 'bayrak', 'kurtuluş', 'meydan', 'coşku'],
        tagsEn: ['Izmir', 'Ataturk', 'flag', 'liberation', 'square', 'enthusiasm'],
        description: 'İzmir\'in kurtuluş coşkusunu, Konak Meydanı ve Saat Kulesi önünde betimleyen tarihsel bir sahne. Türk bayrağını taşıyan askerler ve halkın sevinci canlı renklerle işlenmiş. Arka plandaki dumanlar ve detaylar, savaşın bitişini ve zaferin kazanılışını simgeliyor.',
        descriptionEn: 'A historical scene depicting the enthusiasm of the liberation of Izmir in front of Konak Square and the Clock Tower. Soldiers carrying the Turkish flag and the joy of the people are rendered in vibrant colors. Smoke and details in the background symbolize the end of the war and the winning of victory.',
        status: 'collection',
        image: imagePath('kurtulus.jpg'),
        isForSale: false,
        price: null
    }
];

// Kategorileri dinamik olarak türet
export const getCategories = () => {
    const categories = new Set(artworks.map(a => a.category));
    return ['all', ...Array.from(categories)];
};

export default artworks;
