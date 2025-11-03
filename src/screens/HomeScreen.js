import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';

import { globalStyles } from '../styles/globalStyles';
import { Colors, Spacing, Typography } from '../constants/theme';
import { CATEGORIES } from '../constants/config';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {

  
  const CategoryCard = ({ category, index }) => {
    const handlePress = () => {
      // E-Book kategorisi için özel davranış
      if (category.id === 8) { // E-Book kategorisi
        navigation.navigate('PDFViewer', { category });
      } else {
        navigation.navigate('CategoryDetail', { category });
      }
    };

    return (
      <TouchableOpacity 
        style={[styles.categoryCard, { backgroundColor: category.color }]}
        onPress={handlePress}
      >
        {category.id === 8 && (
          <Image 
            source={require('../../assets/icons/ebook-icon.png')} 
            style={styles.categoryIcon}
            resizeMode="contain"
          />
        )}
        <Text style={[
          styles.categoryTitle, 
          category.id === 8 && styles.ebookTitle
        ]}>
          {category.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCategories = () => {
    const rows = [];
    for (let i = 0; i < CATEGORIES.length; i += 2) {
      rows.push(
        <View key={`category-row-${i}`} style={styles.categoryRow}>
          <CategoryCard key={`category-${CATEGORIES[i].id}`} category={CATEGORIES[i]} index={i} />
          {CATEGORIES[i + 1] && (
            <CategoryCard key={`category-${CATEGORIES[i + 1].id}`} category={CATEGORIES[i + 1]} index={i + 1} />
          )}
        </View>
      );
    }
    return rows;
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {/* Header + İlk 2 Kategori - Beyaz Arkaplan */}
      <View style={styles.headerWithFirstCategories}>
        <View style={styles.header}>
          
          <Text style={styles.welcomeText}>Smart Learn</Text>
          <Text style={styles.subtitle}>Discover amazing educational content</Text>
        </View>

        {/* İlk 2 Kategori - Yarısı beyaz, yarısı pembe üzerinde */}
        <View style={styles.firstCategoriesRow}>
          <CategoryCard category={CATEGORIES[0]} index={0} />
          <CategoryCard category={CATEGORIES[1]} index={1} />
        </View>
      </View>

      {/* Kalan Kategoriler - Radiuslu Arkaplan (Overlap ile yukarı taşıyor) */}
      <View style={styles.categoriesContainer}>
        {CATEGORIES.slice(2).reduce((rows, category, index) => {
          const actualIndex = index + 2;
          if (actualIndex % 2 === 0) {
            rows.push(
              <View key={`category-row-${actualIndex}`} style={styles.categoryRow}>
                <CategoryCard category={category} index={actualIndex} />
                {CATEGORIES[actualIndex + 1] && (
                  <CategoryCard category={CATEGORIES[actualIndex + 1]} index={actualIndex + 1} />
                )}
              </View>
            );
          }
          return rows;
        }, [])}
      </View>
    </ScrollView>
  );
}

 const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Header kısmı beyaz
  },
  headerWithFirstCategories: {
    backgroundColor: '#FFFFFF', // Beyaz arkaplan
    paddingHorizontal: Spacing.md,
  },
  header: {
    backgroundColor: 'transparent', // Şeffaf
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
  },
  firstCategoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0, // Pembe kısmın tam ortasında olması için
    zIndex: 10, // İlk kategoriler en üstte
    position: 'relative', // Z-index çalışması için
  },
  greeting: {
    fontSize: Typography.sizes.xxlarge,
    fontWeight: Typography.weights.bold,
    fontFamily: Typography.families.title,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  welcomeText: {
    fontSize: Typography.sizes.xxlarge,
    fontWeight: Typography.weights.bold,
    fontFamily: Typography.families.title,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: Typography.sizes.medium,
    fontFamily: Typography.families.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  categoriesContainer: {
    flex: 1,
    backgroundColor: Colors.background, // Pembe/krem arkaplan
    borderTopLeftRadius: 100, // Sol üst radius
    borderTopRightRadius: 100, // Sağ üst radius
    marginTop: -70, // Negatif margin ile yukarı taşı (kategori yüksekliğinin yarısı)
    paddingTop: 90, // Üst padding artır (70 + 20 boşluk)
    paddingHorizontal: Spacing.md,
    zIndex: 1, // Arkaplan altta
    position: 'relative', // Z-index çalışması için
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  categoryCard: {
    width: (width - Spacing.md * 3) / 2,
    height: 140,
    borderRadius: 20,
    padding: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    marginBottom: Spacing.sm,
  },
  categoryTitle: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
    fontFamily: Typography.families.title,
    color: Colors.surface,
    textAlign: 'center',
  },
  ebookTitle: {
    color: '#000000', // E-Book için siyah text
  },
});