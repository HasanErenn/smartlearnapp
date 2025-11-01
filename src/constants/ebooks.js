// E-Books Configuration for Smart Learn App
// Static e-book verileri - Elle ekleme için



// CategoryId'den categoryKey'i otomatik hesapla
const getCategoryKey = (categoryId) => {
  const categoryKeys = {
    1: 'arts_music',
    2: 'mother_language',
    3: 'foreign_languages',
    4: 'natural_sciences',
    5: 'physical_education',
    6: 'mathematics',
    7: 'ethics_religion'
  };
  return categoryKeys[categoryId] || 'unknown';
};

export const EBOOKS = [
  {
    id: 1,
    title: 'Creative expression: drawing, art and designing',
    categoryId: 1,                    // Sanat & Müzik kategorisi
    ageRange: { min: 9, max: 10 },
    duration: '1_2_hours',           // TIME_OPTIONS'a uygun
    folderPath: 'arts_music/p1',      // Klasör yolu
    coverImage: require('../../assets/ebooks/arts_music/p1/1.png'), // Kapak resmi
    pages: [
      require('../../assets/ebooks/arts_music/p1/1.png'),
      require('../../assets/ebooks/arts_music/p1/2.png'),
      require('../../assets/ebooks/arts_music/p1/3.png')
    ],
    fileUrl: null
  },
  {
    id: 2,
    title: 'Create and play handmade instruments',
    categoryId: 1,                    // Sanat & Müzik kategorisi
    ageRange: { min: 6, max: 14 },
    duration: '25_45_mins',           // TIME_OPTIONS'a uygun
    folderPath: 'arts_music/p2',      // Klasör yolu
    coverImage: require('../../assets/ebooks/arts_music/p2/1.png'), // Kapak resmi
    pages: [
      require('../../assets/ebooks/arts_music/p2/1.png'),
      require('../../assets/ebooks/arts_music/p2/2.png'),
      require('../../assets/ebooks/arts_music/p2/3.png')
    ],
    fileUrl: null
  },

    {
    id: 3,
    title: 'Visual-spatial perspective',
    categoryId: 6,                    // Natural Sciences
    ageRange: { min: 6, max: 7 },    // 6-10 years
    duration: '25_mins',           // 25-45 minutes
    coverImage: require('../../assets/ebooks/mathematics/p4/1.png'),
    pages: [
      require('../../assets/ebooks/mathematics/p4/1.png'),
      require('../../assets/ebooks/mathematics/p4/2.png')
    ],
    fileUrl: null
  },

    {
    id: 4,
    title: 'Measurements',
    categoryId: 6,                    // Natural Sciences
    ageRange: { min: 8, max: 12 },    // 6-10 years
    duration: '40_mins',           // 25-45 minutes
    coverImage: require('../../assets/ebooks/mathematics/p2/1.png'),
    pages: [
      require('../../assets/ebooks/mathematics/p2/1.png'),
      require('../../assets/ebooks/mathematics/p2/2.png')
    ],
    fileUrl: null
  },

    {
    id: 5,
    title: 'Working with data',
    categoryId: 6,                    // Natural Sciences
    ageRange: { min: 7, max: 12 },    // 6-10 years
    duration: '30_40mins',           // 25-45 minutes
    coverImage: require('../../assets/ebooks/mathematics/p5/1.png'),
    pages: [
      require('../../assets/ebooks/mathematics/p5/1.png'),
      require('../../assets/ebooks/mathematics/p5/2.png'),
      require('../../assets/ebooks/mathematics/p5/3.png'),
      require('../../assets/ebooks/mathematics/p5/4.png'),

    ],
    fileUrl: null
  },

    {
    id: 6,
    title: 'Addition and subtraction of fractions',
    categoryId: 6,                    // Natural Sciences
    ageRange: { min: 7, max: 9 },    // 6-10 years
    duration: '80_mins',           // 25-45 minutes
    coverImage: require('../../assets/ebooks/mathematics/p1/1.png'),
    pages: [
      require('../../assets/ebooks/mathematics/p1/1.png'),
      require('../../assets/ebooks/mathematics/p1/2.png'),
      require('../../assets/ebooks/mathematics/p1/3.png'),
      require('../../assets/ebooks/mathematics/p1/4.png')
    ],
    fileUrl: null
  },

  {
    id: 7,
    title: 'Problem Solving',
    categoryId: 6,                    // Natural Sciences
    ageRange: { min: 7, max: 10 },    // 6-10 years
    duration: '90_mins',           // 25-45 minutes
    coverImage: require('../../assets/ebooks/mathematics/p3/1.png'),
    pages: [
      require('../../assets/ebooks/mathematics/p3/1.png'),
      require('../../assets/ebooks/mathematics/p3/2.png'),
      require('../../assets/ebooks/mathematics/p3/3.png'),
      require('../../assets/ebooks/mathematics/p3/4.png')
    ],
    fileUrl: null
  },

  {
    id: 8,
    title: 'Cultural and spiritual diversity',
    categoryId: 7,                    // Natural Sciences
    ageRange: { min: 7, max: 10 },    // 6-10 years
    duration: '90_mins',           // 25-45 minutes
    coverImage: require('../../assets/ebooks/ethics_religion/p1/1.png'),
    pages: [
      require('../../assets/ebooks/ethics_religion/p1/1.png'),
      require('../../assets/ebooks/ethics_religion/p1/2.png')
    ],
    fileUrl: null
  },

{
    id: 9,
    title:  'Ethical Discussions',
    categoryId: 7,                    // Natural Sciences
    ageRange: { min: 7, max: 10 },    // 6-10 years
    duration: '90_mins',           // 25-45 minutes
    coverImage: require('../../assets/ebooks/ethics_religion/p2/1.png'),
    pages: [
      require('../../assets/ebooks/ethics_religion/p2/1.png'),
      require('../../assets/ebooks/ethics_religion/p2/2.png'),
      require('../../assets/ebooks/ethics_religion/p2/3.png')
    ],
    fileUrl: null
  },

{
    id: 10,
    title: 'Values and Morals',
    categoryId: 7,                    // Natural Sciences
    ageRange: { min: 7, max: 10 },    // 6-10 years
    duration: '90_mins',           // 25-45 minutes
    coverImage: require('../../assets/ebooks/ethics_religion/p3/1.png'),
    pages: [
      require('../../assets/ebooks/ethics_religion/p3/1.png'),
      require('../../assets/ebooks/ethics_religion/p3/2.png')
    ],
    fileUrl: null
  },

    {
    id: 11,
    title: 'Introduction to basic vocabulary',
    categoryId: 3,                    // Natural Sciences
    ageRange: { min: 6, max: 11 },    // 6-10 years
    duration: '60_mins',           // 25-45 minutes
    coverImage: require('../../assets/ebooks/foreign_languages/p2/1.png'),
    pages: [
      require('../../assets/ebooks/foreign_languages/p2/1.png'),
      require('../../assets/ebooks/foreign_languages/p2/2.png'),
      require('../../assets/ebooks/foreign_languages/p2/3.png'),
      require('../../assets/ebooks/foreign_languages/p2/4.png'),
      require('../../assets/ebooks/foreign_languages/p2/5.png'),
    ],
    fileUrl: null
  },

  {
    id: 12,
    title: 'Simple communication',
    categoryId: 3,                    // Natural Sciences
    ageRange: { min: 10, max: 12 },    // 6-10 years
    duration: '45_mins',           // 25-45 minutes
    coverImage: require('../../assets/ebooks/foreign_languages/p1/1.png'),
    pages: [
      require('../../assets/ebooks/foreign_languages/p1/1.png'),
      require('../../assets/ebooks/foreign_languages/p1/2.png'),
      require('../../assets/ebooks/foreign_languages/p1/3.png'),
    ],
    fileUrl: null
  },

  {
    id: 13,
    title: 'Developing comprehension through listening tasks',
    categoryId: 3,                    // Natural Sciences
    ageRange: { min: 7, max: 10 },    // 6-10 years
    duration: '35_mins',           // 25-45 minutes
    coverImage: require('../../assets/ebooks/foreign_languages/p4/1.png'),
    pages: [
      require('../../assets/ebooks/foreign_languages/p4/1.png'),
      require('../../assets/ebooks/foreign_languages/p4/2.png'),
      require('../../assets/ebooks/foreign_languages/p4/3.png'),
      require('../../assets/ebooks/foreign_languages/p4/4.png'),
    ],
    fileUrl: null
  },

  {
    id: 14,
    title: 'Developing comprehension during reading tasks',
    categoryId: 3,                    // Natural Sciences
    ageRange: { min: 10, max: 11 },    // 6-10 years
    duration: '35_40_mins',           // 25-45 minutes
    coverImage: require('../../assets/ebooks/foreign_languages/p3/1.png'),
    pages: [
      require('../../assets/ebooks/foreign_languages/p3/1.png'),
      require('../../assets/ebooks/foreign_languages/p3/2.png'),
      require('../../assets/ebooks/foreign_languages/p3/3.png'),
    ],
    fileUrl: null
  },
  
  // Daha fazla e-book ekleyebilirsiniz...
];

// Enhanced ebook objesi oluştur (multi-page destekli)
export const enhanceEbooks = (ebooks) => {
  return ebooks.map(ebook => ({
    ...ebook,
    pageCount: getEbookPageCount(ebook),
    pages: getEbookPages(ebook)
  }));
};

// E-book filtreleme için yardımcı fonksiyonlar
export const filterEbooks = (ebooks, filters) => {
  const enhancedEbooks = enhanceEbooks(ebooks);
  let filtered = [...enhancedEbooks];
  
  // Kategori filtresi
  if (filters.selectedTopics && filters.selectedTopics.length > 0) {
    filtered = filtered.filter(ebook => 
      filters.selectedTopics.some(topicId => ebook.categoryId === topicId)
    );
  }
  
  // Yaş aralığı filtresi
  if (filters.ageRange && filters.ageRange.length === 2) {
    filtered = filtered.filter(ebook => {
      const [minAge, maxAge] = filters.ageRange;
      return ebook.ageRange.min <= maxAge && ebook.ageRange.max >= minAge;
    });
  }
  
  // Süre filtresi - "all" seçilirse filtreleme yapma
  if (filters.selectedTimes && filters.selectedTimes.length > 0 && !filters.selectedTimes.includes('all')) {
    filtered = filtered.filter(ebook => 
      filters.selectedTimes.includes(ebook.duration)
    );
  }
  
  return filtered;
};

// Otomatik sayfa sayma ve yükleme fonksiyonu
// Basit sayfa yükleme - manuel pages array kullanır
export const getEbookPages = (ebook) => {
  // Eğer ebook'ta pages array'i varsa onu kullan
  if (ebook.pages && ebook.pages.length > 0) {
    return ebook.pages.map((page, index) => ({
      pageNumber: index + 1,
      image: page,
      uri: `${ebook.folderPath}/${index + 1}.png`
    }));
  }
  
  // Fallback: cover image
  return [{ 
    pageNumber: 1, 
    image: ebook.coverImage, 
    uri: ebook.folderPath 
  }];
};

// Ebook'un toplam sayfa sayısını hesapla
export const getEbookPageCount = (ebook) => {
  // Eğer ebook'ta pages array'i varsa onun uzunluğu
  if (ebook.pages && ebook.pages.length > 0) {
    return ebook.pages.length;
  }
  
  // Fallback: tek sayfa
  return 1;
};

// Yardımcı fonksiyonlar
export const getEbooksByCategory = (categoryId) => {
  return EBOOKS.filter(ebook => ebook.categoryId === categoryId);
};

export const getEbookById = (id) => {
  return EBOOKS.find(ebook => ebook.id === id);
};

// Viewer için enhanced ebook objesi - Multi-page destekli
export const getEnhancedEbook = (ebook) => {
  return {
    ...ebook,
    pageCount: getEbookPageCount(ebook),
    pages: getEbookPages(ebook)
  };
};