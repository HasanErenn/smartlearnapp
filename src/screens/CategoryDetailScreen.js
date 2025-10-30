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
import { useTranslation } from 'react-i18next';
import { globalStyles } from '../styles/globalStyles';
import { Colors, Spacing, Typography } from '../constants/theme';
import { getEbooksByCategory } from '../constants/ebooks';

const { width } = Dimensions.get('window');

export default function CategoryDetailScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { category } = route.params;
  
  // Kategoriye göre e-book'ları getir (static)
  const categoryEbooks = getEbooksByCategory(category.id);
  
  // Mock data for other educational materials
  const otherMaterials = [
    {
      id: 1,
      title: `${category.titleTR} 1`,
      type: 'lesson',
      duration: '25 mins',
      difficulty: 'Başlangıç'
    },
    {
      id: 4,
      title: `${category.titleTR}`,
      type: 'activity',
      duration: '15 mins',
      difficulty: 'Başlangıç'
    },
    {
      id: 5,
      title: 'E-Book Title',
      type: 'ebook',
      duration: '60 mins',
      difficulty: 'Orta'
    },
    {
      id: 6,
      title: 'E-Book Title',
      type: 'ebook',
      duration: '40 mins',
      difficulty: 'İleri'
    },
    {
      id: 7,
      title: `${category.titleTR}`,
      type: 'lesson',
      duration: '35 mins',
      difficulty: 'Orta'
    },
    {
      id: 8,
      title: 'E-Book Title',
      type: 'ebook',
      duration: '20 mins',
      difficulty: 'Başlangıç'
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
        alert(`${material.title} açılıyor...`);
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
        {isSpecialCard && (
          <View style={[styles.specialCardBg, { backgroundColor: category.color }]}>
            <Text style={styles.specialCardIcon}>{category.icon}</Text>
            <View style={styles.specialCardContent}>
              <Text style={styles.specialCardTitle}>TEAM PLAY DAY</Text>
              <View style={styles.specialCardDetails}>
                <Text style={styles.specialCardDetail}>Time</Text>
                <Text style={styles.specialCardDetail}>3 hours per semester | 5-7 classes per week</Text>
                <Text style={styles.specialCardDetail}>Methodology</Text>
                <Text style={styles.specialCardDetail}>Team playing and enjoying sport games</Text>
                <Text style={styles.specialCardDetail}>Learning objectives</Text>
                <Text style={styles.specialCardDetail}>• Encourage teamwork communication and networking skills</Text>
                <Text style={styles.specialCardDetail}>• Sports techniques for physical health</Text>
                <Text style={styles.specialCardDetail}>• Discipline and time management</Text>
                <Text style={styles.specialCardDetail}>Required Materials</Text>
                <Text style={styles.specialCardDetail}>• Sports</Text>
                <Text style={styles.specialCardDetail}>• Balls, footballs, soccer, basketballs</Text>
                <Text style={styles.specialCardDetail}>• Playing field</Text>
                <Text style={styles.specialCardDetail}>• Water and some snack for the participants</Text>
              </View>
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
        
        {/* E-book açıklaması */}
        {material.description && (
          <Text style={styles.materialDescription}>
            {material.description}
          </Text>
        )}
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
    <View style={globalStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← {t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.categoryTitle}>
          {t(`categories.${category.key}`) || category.title}
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
  header: {
    paddingTop: 50,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
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
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  regularCardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: 60,
    height: 80,
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