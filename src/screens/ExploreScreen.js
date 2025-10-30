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
import { useTranslation } from 'react-i18next';
import { globalStyles } from '../styles/globalStyles';
import { Colors, Spacing, Typography } from '../constants/theme';
import { CATEGORIES, TIME_OPTIONS, AGE_RANGE } from '../constants/config';
import { EBOOKS, filterEbooks } from '../constants/ebooks';

const { width } = Dimensions.get('window');

export default function ExploreScreen({ navigation }) {
  const { t } = useTranslation();
  const [ageRange, setAgeRange] = useState([AGE_RANGE.min, AGE_RANGE.max]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);

  const TimeOption = ({ option, isSelected, onPress }) => (
    <TouchableOpacity 
      style={[styles.timeOption, isSelected && styles.timeOptionSelected]}
      onPress={onPress}
    >
      <Text style={[styles.timeOptionText, isSelected && styles.timeOptionTextSelected]}>
        {t(`time_options.${option.key}`) || option.value}
      </Text>
    </TouchableOpacity>
  );

  const TopicOption = ({ category, isSelected, onPress }) => (
    <TouchableOpacity 
      style={[styles.topicOption, isSelected && styles.topicOptionSelected]}
      onPress={onPress}
    >
      <Text style={[styles.topicOptionText, isSelected && styles.topicOptionTextSelected]}>
        {t(`categories.${category.key}`) || category.titleTR}
      </Text>
    </TouchableOpacity>
  );

  const toggleTimeSelection = (time) => {
    setSelectedTimes(prev => 
      prev.includes(time) 
        ? prev.filter(t => t !== time)
        : [...prev, time]
    );
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
          <Text style={styles.title}>{t('explore.title')}</Text>
        </View>

        {/* Filters Container */}
        <View style={styles.filtersContainer}>
          
          {/* Age Range */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('explore.age_range')}</Text>
            <View style={styles.ageRangeContainer}>
              <Slider
                style={styles.slider}
                minimumValue={AGE_RANGE.min}
                maximumValue={AGE_RANGE.max}
                value={ageRange[1]}
                onValueChange={(value) => setAgeRange([ageRange[0], Math.round(value)])}
                minimumTrackTintColor={Colors.primary}
                maximumTrackTintColor={Colors.border}
                thumbStyle={styles.sliderThumb}
              />
              <View style={styles.ageLabels}>
                <Text style={styles.ageLabel}>{ageRange[0]}</Text>
                <Text style={styles.ageLabel}>{ageRange[1]}</Text>
              </View>
            </View>
          </View>

          {/* Time Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('explore.time')}</Text>
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
            <Text style={styles.sectionTitle}>{t('explore.topics')}</Text>
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
            <Text style={styles.resetButtonText}>{t('common.reset_filters')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={handleExplore}
          >
            <Text style={styles.exploreButtonText}>{t('common.explore_button')}</Text>
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
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderThumb: {
    backgroundColor: Colors.primary,
    width: 24,
    height: 24,
  },
  ageLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  ageLabel: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.medium,
    color: Colors.text,
  },
  timeOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeOption: {
    backgroundColor: Colors.background,
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
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeOptionText: {
    fontSize: Typography.sizes.medium,
    fontFamily: Typography.families.body,
    color: Colors.text,
    fontWeight: Typography.weights.medium,
  },
  timeOptionTextSelected: {
    color: Colors.surface,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  topicOption: {
    backgroundColor: Colors.background,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 20,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  topicOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  topicOptionText: {
    fontSize: Typography.sizes.medium,
    fontFamily: Typography.families.body,
    color: Colors.text,
  },
  topicOptionTextSelected: {
    color: Colors.surface,
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