import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions 
} from 'react-native';
import Slider from '@react-native-community/slider';

import { globalStyles } from '../styles/globalStyles';
import { Colors, Spacing, Typography } from '../constants/theme';
import { CATEGORIES, TIME_OPTIONS, AGE_RANGE } from '../constants/config';
import { EBOOKS, filterEbooks } from '../constants/ebooks';

const { width } = Dimensions.get('window');

export default function ExploreScreen({ navigation }) {
  const [ageRange, setAgeRange] = useState([AGE_RANGE.min, AGE_RANGE.max]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);

  const TimeOption = ({ option, isSelected, onPress }) => (
    <TouchableOpacity 
      style={[styles.timeOption, isSelected && styles.timeOptionSelected]}
      onPress={onPress}
    >
      <Text style={[styles.timeOptionText, isSelected && styles.timeOptionTextSelected]}>
        {option.value}
      </Text>
    </TouchableOpacity>
  );

  const getTopicColor = (categoryId) => {
    const colorMap = {
      1: Colors.artsMusic,       // Arts & Music
      2: Colors.motherLanguage,  // Mother Language
      3: Colors.foreignLanguages, // Foreign Languages
      4: Colors.naturalSciences, // Natural Sciences
      5: Colors.physicalEducation, // Physical Education
      6: Colors.mathematics,     // Mathematics
      7: Colors.ethicsReligion,  // Ethics & Religion
    };
    return colorMap[categoryId] || Colors.primary;
  };

  const TopicOption = ({ category, isSelected, onPress }) => (
    <TouchableOpacity 
      style={[
        styles.topicOption, 
        isSelected && [
          styles.topicOptionSelected,
          { 
            backgroundColor: getTopicColor(category.id),
            borderColor: getTopicColor(category.id),
            shadowColor: getTopicColor(category.id),
          }
        ]
      ]}
      onPress={onPress}
    >
      <Text style={[styles.topicOptionText, isSelected && styles.topicOptionTextSelected]}>
        {category.title}
      </Text>
    </TouchableOpacity>
  );

  const toggleTimeSelection = (time) => {
    setSelectedTimes(prev => {
      // Eğer "all" seçilirse, diğer tüm seçimleri temizle
      if (time === 'all') {
        return prev.includes('all') ? [] : ['all'];
      }
      
      // Eğer başka bir seçenek seçilirse, "all"ı kaldır
      const newSelection = prev.includes(time) 
        ? prev.filter(t => t !== time)
        : [...prev.filter(t => t !== 'all'), time];
      
      return newSelection;
    });
  };

  const toggleTopicSelection = (categoryId) => {
    setSelectedTopics(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleExplore = () => {
    const filters = {
      ageRange,
      selectedTimes,
      selectedTopics
    };
    
    console.log('Search Filters:', filters);
    console.log('Age Range:', ageRange);
    console.log('Selected Times:', selectedTimes);
    console.log('Selected Topics:', selectedTopics);
    
    navigation.navigate('SearchResults', { filters });
  };

  const resetFilters = () => {
    setAgeRange([AGE_RANGE.min, AGE_RANGE.max]);
    setSelectedTimes([]);
    setSelectedTopics([]);
  };

  return (
    <ScrollView style={globalStyles.container}>
      <View style={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Find What You're Looking For</Text>
        </View>

        {/* Filters Container */}
        <View style={styles.filtersContainer}>
          
          {/* Age Range */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Age Range</Text>
            <View style={styles.ageRangeContainer}>
              
              {/* Min Age Slider */}
              <Text style={styles.sliderLabel}>Minimum Age: {ageRange[0]} years</Text>
              <Slider
                style={styles.slider}
                minimumValue={AGE_RANGE.min}
                maximumValue={ageRange[1] - 1} // Max can't be less than min
                value={ageRange[0]}
                onValueChange={(value) => {
                  const newMin = Math.round(value);
                  setAgeRange([newMin, Math.max(newMin + 1, ageRange[1])]);
                }}
                minimumTrackTintColor={'#FF8629'}
                maximumTrackTintColor={Colors.border}
                thumbStyle={styles.sliderThumb}
                step={1}
              />
              
              {/* Max Age Slider */}
              <Text style={styles.sliderLabel}>Maximum Age: {ageRange[1]} years</Text>
              <Slider
                style={styles.slider}
                minimumValue={ageRange[0] + 1} // Min can't be more than max
                maximumValue={AGE_RANGE.max}
                value={ageRange[1]}
                onValueChange={(value) => {
                  const newMax = Math.round(value);
                  setAgeRange([Math.min(ageRange[0], newMax - 1), newMax]);
                }}
                minimumTrackTintColor={'#FF8629'}
                maximumTrackTintColor={Colors.border}
                thumbStyle={[styles.sliderThumb, { backgroundColor: '#FF8629' }]}
                step={1}
              />
              
              <View style={styles.ageRangeDisplay}>
                <Text style={styles.ageRangeText}>
                  Selected Range: {ageRange[0]} - {ageRange[1]} years
                </Text>
              </View>
            </View>
          </View>

          {/* Time Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Time</Text>
            <View style={styles.timeOptionsContainer}>
              {TIME_OPTIONS.map((option) => (
                <TimeOption
                  key={`time-${option.key}`}
                  option={option}
                  isSelected={selectedTimes.includes(option.key)}
                  onPress={() => toggleTimeSelection(option.key)}
                />
              ))}
            </View>
          </View>

          {/* Topics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Topics</Text>
            <View style={styles.topicsContainer}>
              {CATEGORIES.map((category) => (
                <TopicOption
                  key={`topic-${category.id}`}
                  category={category}
                  isSelected={selectedTopics.includes(category.id)}
                  onPress={() => toggleTopicSelection(category.id)}
                />
              ))}
            </View>
          </View>

        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={resetFilters}
          >
            <Text style={styles.resetButtonText}>Reset Filters</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={handleExplore}
          >
            <Text style={styles.exploreButtonText}>Explore</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  header: {
    marginBottom: Spacing.lg,
    marginTop: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.xxlarge,
    fontWeight: Typography.weights.bold,
    fontFamily: Typography.families.title,
    color: Colors.text,
    lineHeight: 36,
  },
  filtersContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.semibold,
    fontFamily: Typography.families.subtitle,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  ageRangeContainer: {
    marginHorizontal: Spacing.sm,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    padding: Spacing.md,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: Spacing.sm,
  },
  sliderLabel: {
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.medium,
    color: Colors.text,
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
  },
  sliderThumb: {
    backgroundColor: '#FF8629',
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  ageRangeDisplay: {
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: '#FF862915',
    borderRadius: 8,
  },
  ageRangeText: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
    color: '#FF8629',
  },
  timeOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeOption: {
    backgroundColor: 'transparent',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 25,
    marginBottom: Spacing.sm,
    width: (width - Spacing.md * 2 - Spacing.lg * 2 - Spacing.sm) / 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timeOptionSelected: {
    backgroundColor: '#FF8629',
    borderColor: '#FF8629',
    shadowColor: '#FF8629',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  timeOptionText: {
    fontSize: Typography.sizes.medium,
    fontFamily: Typography.families.body,
    color: Colors.text,
    fontWeight: Typography.weights.medium,
  },
  timeOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.semibold,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  topicOption: {
    backgroundColor: 'transparent',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 20,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  topicOptionSelected: {
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  topicOptionText: {
    fontSize: Typography.sizes.medium,
    fontFamily: Typography.families.body,
    color: Colors.text,
  },
  topicOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.semibold,
  },
  buttonsContainer: {
    gap: Spacing.md,
  },
  resetButton: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
  },
  exploreButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  exploreButtonText: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
    color: Colors.surface,
  },
});