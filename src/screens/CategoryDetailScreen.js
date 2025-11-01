import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions,
  Image 
} from 'react-native';

import { globalStyles } from '../styles/globalStyles';
import { Colors, Spacing, Typography } from '../constants/theme';
import { getEbooksByCategory, formatDuration } from '../constants/ebooks';

const { width } = Dimensions.get('window');

export default function CategoryDetailScreen({ route, navigation }) {
  const { category } = route.params;
  
  // Kategoriye göre e-book'ları getir (static)
  const categoryEbooks = getEbooksByCategory(category.id);
  



  const MaterialCard = ({ material, index }) => {
    const isSpecialCard = index === 0; // First card has special design
    
    const handlePress = () => {
      // E-book ise EbookViewer'a yönlendir
      if (material.categoryId && (material.coverImage || material.image)) {
        navigation.navigate('EbookViewer', { ebook: material });
      } else {
        alert(`${material.title} is opening...`);
      }
    };
    
    return (
      <TouchableOpacity 
        style={[
          styles.materialCard,
          isSpecialCard && styles.specialCard
        ]}
        onPress={handlePress}
      >
        {/* Her kart için aynı layout kullan */}
        <View style={styles.ebookSpecialContainer}>
          {/* E-kitap görseli */}
          <Image
            source={material.coverImage || material.image}
            style={styles.ebookSpecialImage}
            resizeMode="cover"
          />
          {/* E-kitap başlığı ve yaş aralığı */}
          <View style={styles.ebookSpecialTitleContainer}>
            <Text style={styles.ebookSpecialTitle} numberOfLines={2}>
              {material.title}
            </Text>
            {/* Age range */}
            <Text style={styles.ageRangeText}>
              {material.ageRange.min}-{material.ageRange.max} years old
            </Text>
          </View>
        </View>

      </TouchableOpacity>
    );
  };

  const renderMaterials = () => {
    const rows = [];
    // Sadece gerçek e-book'ları göster
    const allMaterials = categoryEbooks.map(item => ({...item, uniqueId: `ebook-${item.id}`}));
    
    // 2 kolonlu grid layout
    for (let i = 0; i < allMaterials.length; i += 2) {
      rows.push(
        <View key={`row-${i}`} style={styles.materialRow}>
          {allMaterials.slice(i, i + 2).map((material, index) => (
            <MaterialCard 
              key={material.uniqueId} 
              material={material} 
              index={i + index}
            />
          ))}
        </View>
      );
    }
    return rows;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.categoryTitle}>
          {category.title}
        </Text>
      </View>

      {/* Materials Grid */}
      <ScrollView style={styles.content}>
        {renderMaterials()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    marginBottom: Spacing.sm,
  },
  backButtonText: {
    fontSize: Typography.sizes.medium,
    color: Colors.text,
  },
  categoryTitle: {
    fontSize: Typography.sizes.xlarge,
    fontWeight: Typography.weights.bold,
    fontFamily: Typography.families.title,
    color: Colors.text,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  materialRow: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Kutular arası eşit boşluk
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  materialCard: {
    width: (width - Spacing.lg * 4) / 2, // Daha dar kutular, daha fazla boşluk
    height: 200, // Sabit yükseklik
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.sm,
    marginHorizontal: Spacing.xs, // Yan boşluk
    marginVertical: Spacing.xs, // Dikey boşluk
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2, // Daha belirgin gölge
    shadowRadius: 10,
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  specialCard: {
    // Artık materialCard'ın sabit height'ı kullanılıyor
  },
  specialCardBg: {
    flex: 1,
    borderRadius: 8,
    padding: Spacing.sm,
    position: 'relative',
    overflow: 'hidden',
  },
  specialCardIcon: {
    fontSize: 24,
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.sm,
  },
  specialCardContent: {
    flex: 1,
  },
  specialCardTitle: {
    fontSize: 12,
    fontWeight: Typography.weights.bold,
    color: Colors.surface,
    marginBottom: Spacing.xs,
  },
  specialCardDetails: {
    flex: 1,
  },
  specialCardDetail: {
    fontSize: 8,
    color: Colors.surface,
    lineHeight: 10,
    marginBottom: 2,
  },
  ebookSpecialContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
  },
  ebookSpecialImage: {
    width: '100%',
    height: 120, // Sabit image yüksekliği
    backgroundColor: Colors.background,
    resizeMode: 'cover', // Kapak resmini düzgün fit et
  },
  ebookSpecialTitleContainer: {
    height: 80, // Sabit title container yüksekliği
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.surface,
  },
  ebookSpecialTitle: {
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: Spacing.xs,
  },
  ageRangeText: {
    fontSize: Typography.sizes.tiny,
    fontWeight: Typography.weights.medium,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  durationText: {
    fontSize: Typography.sizes.tiny,
    fontWeight: Typography.weights.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  regularCardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    minHeight: 80,
  },
  materialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  materialIconText: {
    fontSize: 20,
  },
  materialTitle: {
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.medium,
    fontFamily: Typography.families.body,
    color: Colors.text,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  specialMaterialTitle: {
    color: Colors.text,
    fontSize: Typography.sizes.small,
  },
  ebookImage: {
    width: 110,
    height: 130,
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  ebookMeta: {
    fontSize: Typography.sizes.tiny,
    color: Colors.primary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  materialDescription: {
    fontSize: Typography.sizes.tiny,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  pdfIcon: {
    width: 60,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pdfIconText: {
    fontSize: 24,
    marginBottom: 4,
  },
  pdfLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.bold,
  },
});