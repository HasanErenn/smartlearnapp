import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

import { globalStyles } from '../styles/globalStyles';
import { Colors, Spacing, Typography } from '../constants/theme';
import { CATEGORIES } from '../constants/config';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {

  
  const CategoryCard = ({ category, index }) => (
    <TouchableOpacity 
      style={[styles.categoryCard, { backgroundColor: category.color }]}
      onPress={() => navigation.navigate('CategoryDetail', { category })}
    >
      <Text style={styles.categoryTitle}>
        {category.title}
      </Text>
    </TouchableOpacity>
  );

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
      {/* Header - Beyaz Arkaplan */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello!</Text>
        <Text style={styles.welcomeText}>Welcome to Educational App</Text>
        <Text style={styles.subtitle}>Discover amazing educational content</Text>
      </View>

      {/* Categories Grid - Radiuslu Arkaplan */}
      <View style={styles.categoriesContainer}>
        {renderCategories()}
      </View>
    </ScrollView>
  );
}

 const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Header kısmı beyaz
  },
  header: {
    backgroundColor: '#FFFFFF', // Header beyaz
    padding: Spacing.md,
    marginBottom: 0, // Boşluk yok
    paddingBottom: Spacing.xl, // Alt padding
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
    borderTopLeftRadius: 30, // Sol üst radius
    borderTopRightRadius: 30, // Sağ üst radius
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.md,
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
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  categoryTitle: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
    fontFamily: Typography.families.subtitle,
    color: Colors.surface,
    textAlign: 'center',
    lineHeight: 20,
  },
});