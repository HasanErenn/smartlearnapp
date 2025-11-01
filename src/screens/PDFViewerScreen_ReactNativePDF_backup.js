import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  Dimensions,
  StatusBar,
  SafeAreaView
} from 'react-native';
import Pdf from 'react-native-pdf';
import { Ionicons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { Colors, Spacing, Typography } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const PDFViewerScreen = ({ navigation }) => {
  const [pdfSource, setPdfSource] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    preparePDF();
  }, []);

  const preparePDF = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Loading PDF with react-native-pdf...');
      
      // Asset'i yükle
      const asset = Asset.fromModule(require('../../assets/ebooks/pdfs/ebook.pdf'));
      await asset.downloadAsync();
      
      console.log('Asset loaded:', {
        uri: asset.uri,
        localUri: asset.localUri,
        downloaded: asset.downloaded
      });
      
      // React Native PDF için source objesi
      const source = {
        uri: asset.localUri,
        cache: true,
      };
      
      setPdfSource(source);
      setIsLoading(false);
      
      console.log('PDF source set:', source);
    } catch (error) {
      console.error('PDF preparation error:', error);
      setError('PDF yüklenemedi: ' + error.message);
      setIsLoading(false);
    }
  };

  const handleLoadComplete = (numberOfPages, filePath, { width, height }) => {
    console.log('PDF loaded successfully:', numberOfPages, 'pages');
    console.log('PDF dimensions:', width, 'x', height);
    setTotalPages(numberOfPages);
  };

  const handlePageChanged = (page, numberOfPages) => {
    console.log('Page changed:', page, 'of', numberOfPages);
    setCurrentPage(page);
  };

  const handleError = (error) => {
    console.error('PDF viewing error:', error);
    setError('PDF görüntülenirken hata oluştu: ' + error.message);
  };

  const handleLoadProgress = (percent) => {
    console.log('PDF loading progress:', percent + '%');
  };

  const goBack = () => {
    navigation.goBack();
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Smart Learn E-Book</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Loading */}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>PDF yükleniyor...</Text>
          <Text style={styles.loadingSubtext}>React Native PDF ile</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Smart Learn E-Book</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Error */}
        <View style={styles.errorContainer}>
          <Ionicons name="document-text-outline" size={80} color="#ccc" />
          <Text style={styles.errorTitle}>PDF Yüklenemedi</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          
          <TouchableOpacity onPress={preparePDF} style={styles.retryButton}>
            <Ionicons name="refresh" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.retryButtonText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Smart Learn E-Book</Text>
        <View style={styles.headerRight}>
          {totalPages > 0 && (
            <Text style={styles.pageInfo}>
              {currentPage}/{totalPages}
            </Text>
          )}
        </View>
      </View>

      {/* PDF Viewer */}
      <View style={styles.pdfContainer}>
        {pdfSource && (
          <Pdf
            source={pdfSource}
            onLoadComplete={handleLoadComplete}
            onPageChanged={handlePageChanged}
            onError={handleError}
            onLoadProgress={handleLoadProgress}
            onPressLink={(uri) => {
              console.log('Link pressed:', uri);
            }}
            style={styles.pdf}
            page={currentPage}
            horizontal={false}
            spacing={10}
            scale={1.0}
            minScale={0.5}
            maxScale={3.0}
            enablePaging={true}
            enableRTL={false}
            enableAnnotationRendering={true}
            password=""
            renderActivityIndicator={() => (
              <View style={styles.pdfLoadingContainer}>
                <ActivityIndicator color={Colors.primary} size="large" />
                <Text style={styles.pdfLoadingText}>Sayfa yükleniyor...</Text>
              </View>
            )}
            enableDoubleTapZoom={true}
            trustAllCerts={false}
            singlePage={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={true}
            activityIndicator={ActivityIndicator}
            activityIndicatorProps={{
              color: Colors.primary,
              progressTintColor: Colors.primary,
            }}
          />
        )}
      </View>

      {/* Navigation Controls */}
      {totalPages > 1 && (
        <View style={styles.navigationBar}>
          <TouchableOpacity
            onPress={previousPage}
            disabled={currentPage <= 1}
            style={[
              styles.navButton,
              currentPage <= 1 && styles.navButtonDisabled
            ]}
          >
            <Ionicons 
              name="chevron-back" 
              size={20} 
              color={currentPage <= 1 ? '#ccc' : '#fff'} 
            />
            <Text style={[
              styles.navButtonText,
              currentPage <= 1 && styles.navButtonTextDisabled
            ]}>
              Önceki
            </Text>
          </TouchableOpacity>

          <View style={styles.pageDisplay}>
            <Text style={styles.pageText}>
              Sayfa {currentPage} / {totalPages}
            </Text>
          </View>

          <TouchableOpacity
            onPress={nextPage}
            disabled={currentPage >= totalPages}
            style={[
              styles.navButton,
              currentPage >= totalPages && styles.navButtonDisabled
            ]}
          >
            <Text style={[
              styles.navButtonText,
              currentPage >= totalPages && styles.navButtonTextDisabled
            ]}>
              Sonraki
            </Text>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={currentPage >= totalPages ? '#ccc' : '#fff'} 
            />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  
  backButton: {
    padding: Spacing.xs,
  },
  
  headerTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: Spacing.sm,
  },
  
  headerRight: {
    minWidth: 50,
    alignItems: 'flex-end',
  },
  
  pageInfo: {
    fontSize: Typography.sizes.sm,
    color: '#666',
    fontWeight: Typography.weights.medium,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.sizes.md,
    color: '#666',
    fontWeight: Typography.weights.medium,
  },
  
  loadingSubtext: {
    marginTop: Spacing.xs,
    fontSize: Typography.sizes.sm,
    color: '#999',
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: Spacing.xl,
  },
  
  errorTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: '#333',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  
  errorMessage: {
    fontSize: Typography.sizes.md,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
  },
  
  retryButtonText: {
    color: '#fff',
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    marginLeft: Spacing.xs,
  },
  
  buttonIcon: {
    marginRight: Spacing.xs,
  },
  
  pdfContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  pdf: {
    flex: 1,
    width: width,
  },
  
  pdfLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(248, 249, 250, 0.8)',
  },
  
  pdfLoadingText: {
    marginTop: Spacing.sm,
    fontSize: Typography.sizes.md,
    color: '#666',
  },
  
  navigationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    minWidth: 80,
    justifyContent: 'center',
  },
  
  navButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  
  navButtonText: {
    color: '#fff',
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    marginHorizontal: Spacing.xs,
  },
  
  navButtonTextDisabled: {
    color: '#999',
  },
  
  pageDisplay: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: Spacing.md,
  },
  
  pageText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: '#333',
  },
});

export default PDFViewerScreen;