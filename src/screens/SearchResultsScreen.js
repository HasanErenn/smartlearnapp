import React, { useState, useEffect } from 'react';
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
import { CATEGORIES } from '../constants/config';
import { EBOOKS, filterEbooks } from '../constants/ebooks';

const { width } = Dimensions.get('window');

export default function SearchResultsScreen({ route, navigation }) {
  const { filters } = route.params || {};
  const [filteredEbooks, setFilteredEbooks] = useState([]);
  
  useEffect(() => {
    // Filtreleri uygula
    const results = filterEbooks(EBOOKS, filters);
    setFilteredEbooks(results);
  }, [filters]);
  
  // E-book'ları kategoriye göre grupla
  const groupEbooksByCategory = () => {
    const grouped = {};
    filteredEbooks.forEach(ebook => {
      const category = CATEGORIES.find(cat => cat.id === ebook.categoryId);
      const categoryName = category ? (category.titleTR || category.title) : 'Diğer';
      
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(ebook);
    });
    return grouped;
  };
  
  const searchResults = groupEbooksByCategory();

  const EbookCard = ({ ebook }) => (
    <TouchableOpacity 
      style={styles.resultCard}
      onPress={() => navigation.navigate('EbookViewer', { ebook })}
    >
      <View style={styles.cardContent}>
        {ebook.image ? (
          <Image
            source={ebook.image}
            style={styles.ebookImage}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>
              {ebook.fileUrl ? '📄' : '📚'}
            </Text>
          </View>
        )}
        <View style={styles.ebookInfo}>
          <Text style={styles.cardTitle}>{ebook.title}</Text>
          <View style={styles.ebookMeta}>
            <Text style={styles.metaText}>
              {ebook.ageRange.min}-{ebook.ageRange.max} years old
            </Text>
            <Text style={styles.metaText}>
              25-45 minutes
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const CategorySection = ({ categoryName, ebooks }) => (
    <View style={styles.categorySection}>
      <Text style={styles.categoryName}>{categoryName}</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        {ebooks.map((ebook) => (
          <EbookCard key={ebook.id} ebook={ebook} />
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
          <Text style={styles.backButtonText}>← Back to Explore</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Search Results</Text>
      </View>

      {/* Results */}
      <ScrollView style={styles.content}>
        {Object.entries(searchResults).length > 0 ? (
          Object.entries(searchResults).map(([categoryName, ebooks]) => (
            <CategorySection
              key={categoryName}
              categoryName={categoryName}
              ebooks={ebooks}
            />
          ))
        ) : (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>
              No results found for your search criteria
            </Text>
          </View>
        )}
        
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
    width: 200,
    height: 160,
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
  },
  cardContent: {
    flexDirection: 'row',
    flex: 1,
  },
  ebookImage: {
    width: 60,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  ebookInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.medium,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  ebookDescription: {
    fontSize: Typography.sizes.tiny,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  ebookMeta: {
    marginTop: 'auto',
  },
  metaText: {
    fontSize: Typography.sizes.tiny,
    color: Colors.primary,
    marginBottom: 2,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  noResultsText: {
    fontSize: Typography.sizes.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  placeholderImage: {
    width: 60,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  placeholderText: {
    fontSize: 24,
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