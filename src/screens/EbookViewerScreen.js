import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  Dimensions,
  SafeAreaView,
  Modal
} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import { useTranslation } from 'react-i18next';
import { Colors, Spacing, Typography } from '../constants/theme';

const { width, height } = Dimensions.get('window');

export default function EbookViewerScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { ebook } = route.params;
  const [isFullScreen, setIsFullScreen] = useState(false);

  const openFullScreen = () => {
    setIsFullScreen(true);
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {ebook.title}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* E-book Image */}
        <TouchableOpacity onPress={openFullScreen} style={styles.imageContainer}>
          <Image 
            source={ebook.image} 
            style={styles.ebookImage}
            resizeMode="contain"
          />
          <View style={styles.fullScreenHint}>
            <Text style={styles.fullScreenHintText}>
              📱 {t('ebook_viewer.tap_to_fullscreen')}
            </Text>
          </View>
        </TouchableOpacity>

        {/* E-book Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{ebook.title}</Text>
          <Text style={styles.description}>{ebook.description}</Text>
          
          {/* Tags */}
          <View style={styles.tagsContainer}>
            <Text style={styles.tagsLabel}>{t('ebook_viewer.tags')}:</Text>
            <View style={styles.tagsWrapper}>
              {ebook.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Age Range */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('ebook_viewer.age_range')}:</Text>
            <Text style={styles.detailValue}>
              {ebook.ageRange.min}-{ebook.ageRange.max} {t('common.years_old')}
            </Text>
          </View>

          {/* Duration */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('ebook_viewer.duration')}:</Text>
            <Text style={styles.detailValue}>
              {t(`time_options.${ebook.duration}`)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Full Screen Modal */}
      <Modal
        visible={isFullScreen}
        transparent={true}
        animationType="fade"
        onRequestClose={closeFullScreen}
      >
        <View style={styles.fullScreenContainer}>
          <ImageZoom 
            cropWidth={width}
            cropHeight={height}
            imageWidth={width - 40}
            imageHeight={height - 200}
            minScale={0.5}
            maxScale={3}
            enableSwipeDown={true}
            onSwipeDown={closeFullScreen}
            style={styles.imageZoomContainer}
          >
            <Image 
              source={ebook.image} 
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          </ImageZoom>
          
          <TouchableOpacity style={styles.closeButton} onPress={closeFullScreen}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: Colors.primary + '20',
  },
  backButtonText: {
    fontSize: 24,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    textAlign: 'center',
    marginHorizontal: Spacing.sm,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    backgroundColor: Colors.surface,
    margin: Spacing.md,
    borderRadius: 12,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  ebookImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  fullScreenHint: {
    marginTop: Spacing.sm,
    alignItems: 'center',
  },
  fullScreenHintText: {
    fontSize: Typography.sizes.small,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  infoContainer: {
    padding: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.xlarge,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: Typography.sizes.medium,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  tagsContainer: {
    marginBottom: Spacing.lg,
  },
  tagsLabel: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  tagText: {
    fontSize: Typography.sizes.small,
    color: Colors.primary,
    fontWeight: Typography.weights.medium,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + '40',
  },
  detailLabel: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
  },
  detailValue: {
    fontSize: Typography.sizes.medium,
    color: Colors.textSecondary,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  imageZoomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: width - 40,
    height: height - 200,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
});