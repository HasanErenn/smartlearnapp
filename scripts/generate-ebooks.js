const fs = require('fs');
const path = require('path');

// Görsel dosyalarından otomatik e-book verisi üretir
function generateEbooksFromImages() {
  const imagesDir = path.join(__dirname, '../assets/ebooks/images');
  const outputFile = path.join(__dirname, '../src/constants/generated-ebooks.js');
  
  // Eğer images klasörü yoksa oluştur
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
    console.log('📁 assets/ebooks/images klasörü oluşturuldu');
    console.log('💡 Lütfen bu klasöre e-book görsellerinizi ekleyin ve tekrar çalıştırın');
    return;
  }

  // Görsel dosyalarını oku
  const imageFiles = fs.readdirSync(imagesDir)
    .filter(file => /\.(png|jpg|jpeg)$/i.test(file))
    .sort();

  if (imageFiles.length === 0) {
    console.log('❌ assets/ebooks/images klasöründe görsel bulunamadı');
    console.log('💡 PNG, JPG veya JPEG formatında görsel ekleyin');
    return;
  }

  console.log(`📚 ${imageFiles.length} görsel bulundu, e-book verileri üretiliyor...`);

  // Her görsel için e-book verisi oluştur
  const ebooks = imageFiles.map((filename, index) => {
    const nameWithoutExt = path.parse(filename).name;
    const cleanName = nameWithoutExt.replace(/[-_]/g, ' ');
    
    // Dosya adından kategori tahmin etmeye çalış
    const categoryId = guessCategory(nameWithoutExt);
    
    return {
      id: index + 1,
      title: cleanName,
      titleEN: cleanName,
      description: `${cleanName} ile ilgili eğitici içerik`,
      descriptionEN: `Educational content about ${cleanName}`,
      categoryId: categoryId,
      categoryKey: getCategoryKey(categoryId),
      ageRange: {
        min: 6 + (index % 3) * 2, // 6-8, 8-10, 10-12 rotasyonu
        max: 8 + (index % 3) * 2
      },
      duration: ['15_25_mins', '25_45_mins', '1_2_hours'][index % 3],
      image: filename,
      fileUrl: `${nameWithoutExt}.pdf`,
      tags: generateTags(nameWithoutExt),
      difficulty: ['beginner', 'intermediate', 'advanced'][index % 3],
      language: 'tr',
      createdAt: new Date().toISOString().split('T')[0],
      isPopular: index < 3, // İlk 3'ü popüler yap
      isFeatured: index % 4 === 0 // Her 4'te 1'i öne çıkan yap
    };
  });

  // JavaScript dosyası olarak kaydet
  const jsContent = `// Otomatik üretilen e-book verileri
// Bu dosya scripts/generate-ebooks.js tarafından oluşturulmuştur

export const GENERATED_EBOOKS = ${JSON.stringify(ebooks, null, 2)};

// E-book'ları mevcut verilerle birleştir
export function mergeWithExistingEbooks(existingEbooks = []) {
  const existingIds = existingEbooks.map(book => book.id);
  const newBooks = GENERATED_EBOOKS.filter(book => !existingIds.includes(book.id));
  return [...existingEbooks, ...newBooks];
}
`;

  fs.writeFileSync(outputFile, jsContent);
  
  console.log(`✅ ${ebooks.length} e-book verisi oluşturuldu: ${outputFile}`);
  console.log('📝 Şimdi generated-ebooks.js dosyasını kontrol edin ve gerekirse düzenleyin');
  
  return ebooks;
}

// Dosya adından kategori tahmin et
function guessCategory(filename) {
  const lower = filename.toLowerCase();
  
  if (lower.includes('mat') || lower.includes('sayı') || lower.includes('hesap')) return 6; // Mathematics
  if (lower.includes('dil') || lower.includes('okuma') || lower.includes('harf')) return 2; // Mother Language
  if (lower.includes('sanat') || lower.includes('müzik') || lower.includes('resim')) return 1; // Arts & Music
  if (lower.includes('fen') || lower.includes('bilim') || lower.includes('doğa')) return 4; // Natural Sciences
  if (lower.includes('spor') || lower.includes('beden')) return 5; // Physical Education
  if (lower.includes('ingilizce') || lower.includes('english')) return 3; // Foreign Languages
  if (lower.includes('din') || lower.includes('etik') || lower.includes('ahlak')) return 7; // Ethics & Religion
  
  return 1; // Varsayılan: Arts & Music
}

// Kategori ID'den key'e dönüştür
function getCategoryKey(categoryId) {
  const keys = {
    1: 'arts_music',
    2: 'mother_language', 
    3: 'foreign_languages',
    4: 'natural_sciences',
    5: 'physical_education',
    6: 'mathematics',
    7: 'ethics_religion'
  };
  return keys[categoryId] || 'arts_music';
}

// Dosya adından etiket üret
function generateTags(filename) {
  const words = filename.toLowerCase()
    .replace(/[-_]/g, ' ')
    .split(' ')
    .filter(word => word.length > 2);
  
  return words.slice(0, 3); // İlk 3 kelimeyi etiket yap
}

// Script'i çalıştır
if (require.main === module) {
  generateEbooksFromImages();
}

module.exports = { generateEbooksFromImages };