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
  StatusBar
} from 'react-native';
import Pdf from 'react-native-pdf';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import { Colors, Spacing, Typography } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const PDFViewerScreen = ({ navigation }) => {
  const [pdfUri, setPdfUri] = useState(null);
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
      console.log('Preparing PDF for native viewer...');
      
      // Asset'i yükle
      const asset = Asset.fromModule(require('../../assets/ebooks/pdfs/ebook.pdf'));
      await asset.downloadAsync();
      
      console.log('PDF Asset loaded:', {
        uri: asset.uri,
        localUri: asset.localUri,
        downloaded: asset.downloaded
      });
      
      // Native PDF viewer için local URI kullan
      setPdfUri(asset.localUri);
      setIsLoading(false);
    } catch (error) {
      console.error('PDF preparation error:', error);
      setError('PDF yüklenemedi');
      setIsLoading(false);
    }
  };

  const handleLoadComplete = (numberOfPages, filePath) => {
    console.log('PDF loaded successfully:', numberOfPages, 'pages');
    setTotalPages(numberOfPages);
  };

  const handlePageChanged = (page, numberOfPages) => {
    console.log('Page changed:', page, 'of', numberOfPages);
    setCurrentPage(page);
  };

  const handleError = (error) => {
    console.error('PDF viewing error:', error);
    setError('PDF görüntülenirken hata oluştu');
  };

  const goBack = () => {
    navigation.goBack();
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
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
        {pdfUri && (
          <Pdf
            source={{ uri: pdfUri, cache: true }}
            onLoadComplete={handleLoadComplete}
            onPageChanged={handlePageChanged}
            onError={handleError}
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
              <ActivityIndicator color={Colors.primary} size="large" />
            )}
            enableDoubleTapZoom={true}
            trustAllCerts={false}
          />
        )}
      </View>

      {/* Navigation Controls */}
      {totalPages > 1 && (
        <View style={styles.navigationBar}>
          <TouchableOpacity
            onPress={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            style={[
              styles.navButton,
              currentPage <= 1 && styles.navButtonDisabled
            ]}
          >
            <Ionicons 
              name="chevron-back" 
              size={24} 
              color={currentPage <= 1 ? '#ccc' : '#333'} 
            />
          </TouchableOpacity>

          <View style={styles.pageDisplay}>
            <Text style={styles.pageText}>
              Sayfa {currentPage} / {totalPages}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            style={[
              styles.navButton,
              currentPage >= totalPages && styles.navButtonDisabled
            ]}
          >
            <Ionicons 
              name="chevron-forward" 
              size={24} 
              color={currentPage >= totalPages ? '#ccc' : '#333'} 
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
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
  },
  
  retryButtonText: {
    color: '#fff',
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
  
  pdfContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  pdf: {
    flex: 1,
    width: width,
    height: height - 120, // Header ve navigation için yer bırak
  },
  
  navigationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
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
    padding: Spacing.sm,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  
  navButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
  
  pageDisplay: {
    flex: 1,
    alignItems: 'center',
  },
  
  pageText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    color: '#333',
  },
});

export default PDFViewerScreen;