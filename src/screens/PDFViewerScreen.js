import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Dimensions, TouchableOpacity, Text, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';
import Pdf from 'react-native-pdf';

const { width, height } = Dimensions.get('window');

const PDFViewerScreen = ({ navigation }) => {
  const [pdfUri, setPdfUri] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    preparePDF();
  }, []);

  const preparePDF = async () => {
    try {
      setIsLoading(true);
      
      // Load PDF asset
      const asset = Asset.fromModule(require('../../assets/ebooks/pdfs/ebook.pdf'));
      await asset.downloadAsync();

      let pdfUriToSet = asset.uri || asset.localUri;

      if (Platform.OS === 'android') {
        // Android için PDF dosyasını yerel depolama alanına kopyala
        const pdfDir = FileSystem.documentDirectory + 'pdfs/';
        const pdfFile = pdfDir + 'ebook.pdf';
        
        // Dizini oluştur
        await FileSystem.makeDirectoryAsync(pdfDir, { intermediates: true });
        
        // Dosyayı kopyala
        await FileSystem.copyAsync({
          from: asset.localUri,
          to: pdfFile,
        });
        
        pdfUriToSet = pdfFile;
      }

      setPdfUri(pdfUriToSet);
    } catch (error) {
      Alert.alert('Error', 'Failed to load PDF');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const goBack = () => {
    navigation.goBack();
  };

  const renderPDFViewer = () => {
    if (Platform.OS === 'android') {
      // Android için react-native-pdf kullan
      return (
        <Pdf
          source={{ 
            uri: pdfUri.startsWith('file://') ? pdfUri : `file://${pdfUri}`,
            cache: true 
          }}
          onLoadComplete={(numberOfPages, filePath) => {
            // PDF loaded successfully
          }}
          onPageChanged={(page, numberOfPages) => {
            // Page changed
          }}
          onError={(error) => {
            Alert.alert('Error', 'Failed to load PDF');
          }}
          onLinkPressed={(uri) => {
            // HTTP/HTTPS linkleri tarayıcıda aç
            if (uri.startsWith('http://') || uri.startsWith('https://')) {
              Linking.openURL(uri).catch((err) => {
                Alert.alert('Error', 'Failed to open link');
              });
            }
          }}
          style={styles.pdf}
          enablePaging={true}
          horizontal={false}
          trustAllCerts={false}
        />
      );
    } else {
      // iOS için mevcut WebView çözümü
      return (
        <WebView
          source={{
            html: `
              <html>
                <head>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
                  <style>
                    * {
                      margin: 0;
                      padding: 0;
                      box-sizing: border-box;
                    }
                    body {
                      margin: 0;
                      padding: 0;
                      background: #f5f5f5;
                      overflow-x: auto;
                      overflow-y: auto;
                      height: 100vh;
                    }
                    .pdf-container {
                      width: 100%;
                      height: 100vh;
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                    }
                    embed, object {
                      width: 100%;
                      height: 100vh;
                      border: none;
                    }
                  </style>
                </head>
                <body>
                  <div class="pdf-container">
                    <!-- Use a single embed to avoid duplicate rendering. If the browser/app doesn't support embed, the PDF may not show; iframe fallback removed to prevent double display. -->
                    <embed src="${pdfUri}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH" type="application/pdf" width="100%" height="100%" />
                  </div>
                </body>
              </html>
            `
          }}
          style={styles.webview}
          startInLoadingState={true}
          scalesPageToFit={true}
          scrollEnabled={true}
          bounces={true}
          showsVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={true}
          onShouldStartLoadWithRequest={(request) => {
            // PDF dosyası ile ilgili URL'ler WebView içinde açılsın
            if (request.url.includes(pdfUri) || request.url.includes('blob:') || request.url.includes('data:')) {
              return true;
            }
            // Diğer tüm linkler (http, https) telefon tarayıcısında açılsın
            if (request.url.startsWith('http://') || request.url.startsWith('https://')) {
              Linking.openURL(request.url).catch((err) => {
                Alert.alert('Error', 'Failed to open link');
              });
              return false;
            }
            return true;
          }}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          )}
        />
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Smart Learn E-Book</Text>
        <View style={styles.headerRight} />
      </View>

      {pdfUri ? renderPDFViewer() : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.primary || '#007AFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerRight: {
    width: 40, // Same width as back button for centering
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
    width: width,
  },
  pdf: {
    flex: 1,
    width: width,
  },
});

export default PDFViewerScreen;
