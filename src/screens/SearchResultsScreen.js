import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions 
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { globalStyles } from '../styles/globalStyles';
import { Colors, Spacing, Typography } from '../constants/theme';
import { CATEGORIES } from '../constants/config';

const { width } = Dimensions.get('window');

export default function SearchResultsScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { filters } = route.params || {};
  
  // Mock search results grouped by category
  const searchResults = {
    'Mother Language': [
      { id: 1, title: 'E-Book Title', type: 'ebook' },
      { id: 2, title: 'E-Book Title', type: 'ebook' },
      { id: 3, title: 'E-Book Title', type: 'ebook' },
    ],
    'Foreign Languages': [
      { id: 4, title: 'E-Book Title', type: 'ebook' },
      { id: 5, title: 'E-Book Title', type: 'ebook' },
      { id: 6, title: 'E-Book Title', type: 'ebook' },
    ],
    'Ethics & Religion': [
      { id: 7, title: 'E-Book Title', type: 'ebook' },
      { id: 8, title: 'E-Book Title', type: 'ebook' },
    ],
  };

  const ResultCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.resultCard}
      onPress={() => alert(`${item.title} açılıyor...`)}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardIcon}>
          <Text style={styles.cardIconText}>•</Text>
        </View>
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const CategorySection = ({ categoryName, items }) => (
    <View style={styles.categorySection}>
      <Text style={styles.categoryName}>{categoryName}</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        {items.map((item) => (
          <ResultCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={globalStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← {t('category_detail.back_to_explore')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('search_results.title')}</Text>
      </View>

      {/* Results */}
      <ScrollView style={styles.content}>
        {Object.entries(searchResults).map(([categoryName, items]) => (
          <CategorySection
            key={categoryName}
            categoryName={categoryName}
            items={items}
          />
        ))}
        
        {/* Filter Summary */}
        {filters && (
          <View style={styles.filterSummary}>
            <Text style={styles.filterTitle}>Uygulanan Filtreler:</Text>
            {filters.ageRange && (
              <Text style={styles.filterText}>
                Yaş: {filters.ageRange[0]} - {filters.ageRange[1]}
              </Text>
            )}
            {filters.selectedTimes && filters.selectedTimes.length > 0 && (
              <Text style={styles.filterText}>
                Süre: {filters.selectedTimes.join(', ')}
              </Text>
            )}
            {filters.selectedTopics && filters.selectedTopics.length > 0 && (
              <Text style={styles.filterText}>
                Konular: {filters.selectedTopics.length} konu seçildi
              </Text>
            )}
          </View>
        )}
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
  title: {
    fontSize: Typography.sizes.xlarge,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  categorySection: {
    marginBottom: Spacing.xl,
  },
  categoryName: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  horizontalScroll: {
    paddingRight: Spacing.md,
  },
  resultCard: {
    width: 120,
    height: 140,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.sm,
    marginRight: Spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIconText: {
    fontSize: 24,
  },
  cardTitle: {
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.medium,
    color: Colors.text,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  filterSummary: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 12,
    marginTop: Spacing.lg,
  },
  filterTitle: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  filterText: {
    fontSize: Typography.sizes.small,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
});