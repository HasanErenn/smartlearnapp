import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  Dimensions,
  SafeAreaView,
  Modal,
  FlatList
} from 'react-native';
// import ImageZoom from 'react-native-image-pan-zoom';

import { Colors, Spacing, Typography } from '../constants/theme';
import { getEbookPages, formatDuration } from '../constants/ebooks';

const { width, height } = Dimensions.get('window');

export default function EbookViewerScreen({ route, navigation }) {
  const { ebook } = route.params;
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const flatListRef = useRef(null);

  useEffect(() => {
    // Ebook sayfalarını yükle
    const ebookPages = getEbookPages(ebook);
    setPages(ebookPages);
  }, [ebook]);

  const openFullScreen = () => {
    setIsFullScreen(true);
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
  };

  const goToNextPage = () => {
    if (currentPage < pages.length - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      flatListRef.current?.scrollToIndex({ index: nextPage, animated: true });
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      flatListRef.current?.scrollToIndex({ index: prevPage, animated: true });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Page Counter */}
      <View style={styles.pageCounter}>
        <Text style={styles.pageCounterText}>
          {pages.length > 0 ? `${currentPage + 1} / ${pages.length}` : '0 / 0'}
        </Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Gallery View */}
        {pages.length > 0 && (
          <FlatList
            ref={flatListRef}
            data={pages}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.pageNumber.toString()}
            onMomentumScrollEnd={(event) => {
              const pageIndex = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentPage(pageIndex);
            }}
            getItemLayout={(data, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={openFullScreen} style={styles.pageContainer}>
                <Image 
                  source={item.image} 
                  style={styles.pageImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
          />
        )}

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity 
            style={[styles.navButton, styles.prevButton, currentPage === 0 && styles.navButtonDisabled]}
            onPress={goToPrevPage}
            disabled={currentPage === 0}
          >
            <Text style={[styles.navButtonText, currentPage === 0 && styles.navButtonTextDisabled]}>
              ← Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navButton, styles.nextButton, currentPage === pages.length - 1 && styles.navButtonDisabled]}
            onPress={goToNextPage}
            disabled={currentPage === pages.length - 1}
          >
            <Text style={[styles.navButtonText, currentPage === pages.length - 1 && styles.navButtonTextDisabled]}>
              Next →
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* E-book Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{ebook.title}</Text>

        {/* Age Range */}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Age Range:</Text>
          <Text style={styles.detailValue}>
            {ebook.ageRange.min}-{ebook.ageRange.max} years old
          </Text>
        </View>

        {/* Duration */}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Duration:</Text>
          <Text style={styles.detailValue}>
            {formatDuration(ebook.duration)}
          </Text>
        </View>
      </View>

      {/* Full Screen Modal */}
      <Modal
        visible={isFullScreen}
        transparent={true}
        animationType="fade"
        onRequestClose={closeFullScreen}
      >
        <View style={styles.fullScreenContainer}>
          {pages.length > 0 && pages[currentPage] && (
            <Image 
              source={pages[currentPage].image} 
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          )}
          
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
  pageCounter: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pageCounterText: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
  },
  pageContainer: {
    width: width,
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginVertical: Spacing.md,
  },
  pageImage: {
    width: width - 32,
    height: 380,
    borderRadius: 12,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  navButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    minWidth: 100,
    alignItems: 'center',
  },
  prevButton: {
    marginRight: Spacing.sm,
  },
  nextButton: {
    marginLeft: Spacing.sm,
  },
  navButtonDisabled: {
    backgroundColor: Colors.border,
  },
  navButtonText: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
    color: Colors.surface,
  },
  navButtonTextDisabled: {
    color: Colors.textSecondary,
  },
});