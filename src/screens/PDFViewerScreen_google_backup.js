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
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import * as Sharing from 'expo-sharing';
import { Colors, Spacing, Typography } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const PDFViewerScreen = ({ navigation }) => {
  const [pdfUri, setPdfUri] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [webViewKey, setWebViewKey] = useState(0);

  useEffect(() => {
    preparePDF();
  }, []);

  const preparePDF = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Preparing PDF for Google Docs Viewer...');
      
      // Asset'i yükle
      const asset = Asset.fromModule(require('../../assets/ebooks/pdfs/ebook.pdf'));
      await asset.downloadAsync();
      
      console.log('PDF Asset loaded:', {
        uri: asset.uri,
        localUri: asset.localUri,
        downloaded: asset.downloaded
      });
      
      // Google Docs Viewer ile HTTP URI kullan
      const googleViewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(asset.uri)}`;
      console.log('Google Viewer URL:', googleViewerUrl);
      
      setPdfUri(googleViewerUrl);
      setIsLoading(false);
    } catch (error) {
      console.error('PDF preparation error:', error);
      setError('PDF yüklenemedi');
      setIsLoading(false);
    }
  };

  const reloadPDF = () => {
    setWebViewKey(prev => prev + 1);
    preparePDF();
  };

  const sharePDF = async () => {
    try {
      const asset = Asset.fromModule(require('../../assets/ebooks/pdfs/ebook.pdf'));
      await asset.downloadAsync();
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(asset.localUri);
      } else {
        Alert.alert('Paylaşım', 'Bu cihazda paylaşım özelliği mevcut değil');
      }
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Hata', 'PDF paylaşılırken hata oluştu');
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  const handleWebViewError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    setError('PDF görüntülenirken hata oluştu');
  };

  const handleWebViewLoad = () => {
    console.log('WebView loaded successfully');
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
          <TouchableOpacity onPress={sharePDF} style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Error */}
        <View style={styles.errorContainer}>
          <Ionicons name="document-text-outline" size={80} color="#ccc" />
          <Text style={styles.errorTitle}>PDF Yüklenemedi</Text>
          <Text style={styles.errorMessage}>
            PDF dosyası görüntülenemedi. Lütfen tekrar deneyin veya PDF'yi paylaşım menüsünden açın.
          </Text>
          
          <View style={styles.errorButtons}>
            <TouchableOpacity onPress={reloadPDF} style={styles.retryButton}>
              <Ionicons name="refresh" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.retryButtonText}>Tekrar Dene</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={sharePDF} style={styles.shareButtonAlt}>
              <Ionicons name="share-outline" size={20} color={Colors.primary} style={styles.buttonIcon} />
              <Text style={styles.shareButtonText}>PDF'yi Paylaş</Text>
            </TouchableOpacity>
          </View>
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
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={reloadPDF} style={styles.actionButton}>
            <Ionicons name="refresh" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity onPress={sharePDF} style={styles.actionButton}>
            <Ionicons name="share-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* PDF Viewer */}
      <View style={styles.pdfContainer}>
        {pdfUri && (
          <WebView
            key={webViewKey}
            source={{ uri: pdfUri }}
            style={styles.webview}
            onLoad={handleWebViewLoad}
            onError={handleWebViewError}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.webviewLoading}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.webviewLoadingText}>PDF yükleniyor...</Text>
              </View>
            )}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsBackForwardNavigationGestures={false}
            scalesPageToFit={true}
            bounces={false}
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
          />
        )}
      </View>

      {/* Info Bar */}
      <View style={styles.infoBar}>
        <View style={styles.infoContent}>
          <Ionicons name="information-circle-outline" size={16} color="#666" />
          <Text style={styles.infoText}>
            PDF Google Docs Viewer ile görüntüleniyor
          </Text>
        </View>
      </View>
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
  },
  
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  actionButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  
  shareButton: {
    padding: Spacing.xs,
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
  
  errorButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
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
  },
  
  shareButtonAlt: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
  },
  
  shareButtonText: {
    color: Colors.primary,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
  
  buttonIcon: {
    marginRight: Spacing.xs,
  },
  
  pdfContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  webview: {
    flex: 1,
  },
  
  webviewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  
  webviewLoadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.sizes.md,
    color: '#666',
    fontWeight: Typography.weights.medium,
  },
  
  infoBar: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  
  infoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  infoText: {
    fontSize: Typography.sizes.xs,
    color: '#666',
    marginLeft: Spacing.xs,
  },
});

export default PDFViewerScreen;