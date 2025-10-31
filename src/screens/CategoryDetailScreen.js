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
import { getEbooksByCategory } from '../constants/ebooks';

const { width } = Dimensions.get('window');

export default function CategoryDetailScreen({ route, navigation }) {
  const { category } = route.params;
  
  // Kategoriye göre e-book'ları getir (static)
  const categoryEbooks = getEbooksByCategory(category.id);
  
  // Mock data for other educational materials
  const otherMaterials = [
    {
      id: 1,
      title: `${category.title} 1`,
      type: 'lesson',
      duration: '25 mins',
      difficulty: 'Beginner'
    },
    {
      id: 2,
      title: `${category.title}`,
      type: 'exercise',
      duration: '15 mins',
      difficulty: 'Intermediate'
    },
    {
      id: 5,
      title: 'E-Book Title',
      type: 'ebook',
      duration: '60 mins',
      difficulty: 'Intermediate'
    },
    {
      id: 6,
      title: 'E-Book Title',
      type: 'ebook',
      duration: '40 mins',
      difficulty: 'Advanced'
    },
    {
      id: 7,
      title: `${category.title}`,
      type: 'lesson',
      duration: '35 mins',
      difficulty: 'Intermediate'
    },
    {
      id: 8,
      title: 'E-Book Title',
      type: 'ebook',
      duration: '20 mins',
      difficulty: 'Beginner'
    },
    {
      id: 9,
      title: 'E-Book Title',
      type: 'ebook',
      duration: '50 mins',
      difficulty: 'İleri'
    },
  ];

  const MaterialCard = ({ material, index }) => {
    const isSpecialCard = index === 0; // First card has special design
    
    const handlePress = () => {
      // E-book ise EbookViewer'a yönlendir
      if (material.categoryId && material.image) {
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
        {isSpecialCard && categoryEbooks.length > 0 && (
          <View style={styles.ebookSpecialContainer}>
            {/* E-kitap görseli */}
            <Image
              source={categoryEbooks[0].image}
              style={styles.ebookSpecialImage}
              resizeMode="cover"
            />
            {/* E-kitap başlığı */}
            <View style={styles.ebookSpecialTitleContainer}>
              <Text style={styles.ebookSpecialTitle} numberOfLines={2}>
                {categoryEbooks[0].title}
              </Text>
            </View>
          </View>
        )}
        
        {!isSpecialCard && (
          <View style={styles.regularCardContent}>
            {/* E-book için özel görsel/dosya göster */}
            {material.image ? (
              // PNG görsel varsa direkt göster  
              <Image
                source={material.image}
                style={styles.ebookImage}
                resizeMode="cover"
              />
            ) : material.fileUrl ? (
              // PDF dosyası varsa PDF ikonu göster
              <View style={styles.pdfIcon}>
                <Text style={styles.pdfIconText}>📄</Text>
                <Text style={styles.pdfLabel}>PDF</Text>
              </View>
            ) : (
              // Hiçbiri yoksa varsayılan ikon
              <View style={styles.materialIcon}>
                <Text style={styles.materialIconText}>📚</Text>
              </View>
            )}
            
            {/* E-book meta bilgileri */}
            {material.ageRange && (
              <Text style={styles.ebookMeta}>
                {material.ageRange.min}-{material.ageRange.max} yaş
              </Text>
            )}
          </View>
        )}
        
        <Text style={[styles.materialTitle, isSpecialCard && styles.specialMaterialTitle]}>
          {material.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderMaterials = () => {
    const rows = [];
    // E-book'ları ve diğer materyalleri birleştir ve benzersiz key'ler ekle
    const allMaterials = [
      ...categoryEbooks.map(item => ({...item, uniqueId: `ebook-${item.id}`})),
      ...otherMaterials.map(item => ({...item, uniqueId: `material-${item.id}`}))
    ];
    
    for (let i = 0; i < allMaterials.length; i += 3) {
      rows.push(
        <View key={`row-${i}`} style={styles.materialRow}>
          {allMaterials.slice(i, i + 3).map((material, index) => (
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
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  materialCard: {
    width: (width - Spacing.md * 4) / 3,
    height: 160,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  specialCard: {
    height: 200,
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
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
  },
  ebookSpecialImage: {
    width: '100%',
    height: 140,
    backgroundColor: Colors.background,
  },
  ebookSpecialTitleContainer: {
    flex: 1,
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