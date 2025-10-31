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
    id: 2,
    title: 'Art Project 1',
    categoryId: 1,                    // Sanat & Müzik kategorisi
    ageRange: { min: 8, max: 12 },
    duration: '30_45_mins',           
    folderPath: 'arts_music/p1',      // Klasör yolu
    coverImage: require('../../assets/ebooks/arts_music/p1/1.png'), // Kapak resmi
    pageCount: 3, // Manuel sayfa sayısı
    pages: [
      require('../../assets/ebooks/arts_music/p1/1.png'),
      require('../../assets/ebooks/arts_music/p1/2.png'),
      require('../../assets/ebooks/arts_music/p1/3.png')
    ],
    fileUrl: null
  },
  {
    id: 3,
    title: 'Art Project 2',
    categoryId: 1,                    // Sanat & Müzik kategorisi
    ageRange: { min: 8, max: 12 },
    duration: '30_45_mins',           
    folderPath: 'arts_music/p2',      // Klasör yolu
    coverImage: require('../../assets/ebooks/arts_music/p2/1.png'), // Kapak resmi
    pageCount: 3, // Manuel sayfa sayısı
    pages: [
      require('../../assets/ebooks/arts_music/p2/1.png'),
      require('../../assets/ebooks/arts_music/p2/2.png'),
      require('../../assets/ebooks/arts_music/p2/3.png')
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
  
  // Süre filtresi
  if (filters.selectedTimes && filters.selectedTimes.length > 0) {
    filtered = filtered.filter(ebook => 
      filters.selectedTimes.includes(ebook.duration)
    );
  }
  
  return filtered;
};

// Otomatik sayfa sayma ve yükleme fonksiyonu
// Bir ebook'un sayfalarını yükle (Viewer için) - Multi-page sistem
export const getEbookPages = (ebook) => {
  // Eğer ebook'ta pages array'i varsa onu kullan
  if (ebook.pages && ebook.pages.length > 0) {
    return ebook.pages.map((page, index) => ({
      pageNumber: index + 1,
      image: page,
      uri: `${ebook.folderPath}/${index + 1}.png`
    }));
  }
  
  // Fallback: tek sayfa
  return [{ 
    pageNumber: 1, 
    image: ebook.coverImage, 
    uri: ebook.folderPath 
  }];
};

// Ebook'un toplam sayfa sayısını hesapla
export const getEbookPageCount = (ebook) => {
  // Eğer manuel pageCount varsa onu kullan
  if (ebook.pageCount) {
    return ebook.pageCount;
  }
  
  // Eğer pages array'i varsa onun uzunluğunu al
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