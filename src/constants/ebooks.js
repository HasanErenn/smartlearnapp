// E-Books Configuration for Smart Learn App
// Static e-book verileri - Elle ekleme için



// CategoryId'den categoryKey'i otomatik hesapla
const getCategoryKey = (categoryId) => {
  const categoryKeys = {
    1: 'arts_music',
    2: 'mother_language',
    3: 'foreign_languages',
    4: 'natural_sciences',
    5: 'social_studies',
    6: 'mathematics',
    7: 'technology'
  };
  return categoryKeys[categoryId] || 'unknown';
};

export const EBOOKS = [
  {
    id: 1,
    title: 'Mathematics E-Book',
    categoryId: 4,                    // Natural Sciences
    ageRange: { min: 6, max: 10 },    // 6-10 years
    duration: '25_45_mins',           // 25-45 minutes
    image: require('../../assets/ebooks/images/1.jpeg'),
    fileUrl: null
  },
  
  // Elle daha fazla e-book ekleyebilirsiniz...
];

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

// E-book'lara otomatik categoryKey ekle
const enhanceEbooks = (ebooks) => {
  return ebooks.map(ebook => ({
    ...ebook,
    categoryKey: getCategoryKey(ebook.categoryId)
  }));
};

// Kategoriye göre e-book'ları getir (static)
export const getEbooksByCategory = (categoryId) => {
  const enhancedEbooks = enhanceEbooks(EBOOKS);
  return enhancedEbooks.filter(ebook => ebook.categoryId === categoryId);
};

// Tüm e-book'ları categoryKey ile getir
export const getAllEbooks = () => {
  return enhanceEbooks(EBOOKS);
};

// Yaş aralığına göre e-book'ları getir
export const getEbooksByAgeRange = (minAge, maxAge) => {
  const enhancedEbooks = enhanceEbooks(EBOOKS);
  return enhancedEbooks.filter(ebook => 
    ebook.ageRange.min <= maxAge && ebook.ageRange.max >= minAge
  );
};