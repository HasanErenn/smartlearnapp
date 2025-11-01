import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Pdf from 'react-native-pdf';
import { Colors, Spacing, Typography } from '../constants/theme';

const { width, height } = Dimensions.get('window');

export default function PDFInAppViewerReactNativePdf({ navigation, route }) {
  const { pdfUri, pdfLocalUri } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const goBack = () => navigation.goBack();

  const onLoadComplete = (numberOfPages, filePath) => {
    console.log('PDF loaded:', numberOfPages, 'pages');
    setTotalPages(numberOfPages);
    setLoading(false);
    setError(null);
  };

  const onPageChanged = (page, numberOfPages) => {
    console.log('Page changed:', page, '/', numberOfPages);
    setCurrentPage(page);
  };

  const onError = (error) => {
    console.error('PDF Error:', error);
    setError(error.message || 'PDF yüklenemedi');
    setLoading(false);
  };

  const onLoadProgress = (percent) => {
    console.log('PDF Load progress:', percent);
  };

  // Use local URI first, fallback to HTTP URI
  const source = {
    uri: pdfLocalUri || pdfUri,
    cache: true,
  };

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>E-Book</Text>
          <View style={styles.headerRight} />
        </View>
        
        <View style={styles.errorContainer}>
          <Ionicons name="document-text-outline" size={80} color="#ccc" />
          <Text style={styles.errorTitle}>PDF Yüklenemedi</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Text style={styles.errorNote}>
            Bu sorunu çözmek için bir development build gerekiyor. 
            Expo Go'da native PDF kütüphaneleri sınırlı çalışır.
          </Text>
          <TouchableOpacity 
            onPress={() => {
              setError(null);
              setLoading(true);
            }} 
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>E-Book</Text>
        {totalPages > 0 && (
          <View style={styles.pageInfo}>
            <Text style={styles.pageInfoText}>{currentPage}/{totalPages}</Text>
          </View>
        )}
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>PDF yükleniyor...</Text>
        </View>
      )}

      <View style={styles.pdfContainer}>
        <Pdf
          trustAllCerts={false}
          source={source}
          onLoadComplete={onLoadComplete}
          onPageChanged={onPageChanged}
          onError={onError}
          onLoadProgress={onLoadProgress}
          style={styles.pdf}
          spacing={10}
          enablePaging={true}
          enableRTL={false}
          enableAntialiasing={true}
          enableAnnotationRendering={true}
          password=""
          scale={1.0}
          minScale={0.5}
          maxScale={3.0}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={true}
          enableDoubleTapZoom={true}
          singlePage={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerButton: {
    padding: Spacing.xs
  },
  headerTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40
  },
  pageInfo: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pageInfoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  pdfContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  pdf: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: '#f5f5f5'
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: Spacing.sm,
    color: '#666',
    fontSize: Typography.sizes.md
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: Spacing.sm,
  },
  errorNote: {
    fontSize: Typography.sizes.sm,
    color: '#999',
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 20,
    fontStyle: 'italic',
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
});