import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import { Colors } from '../constants/theme';

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

      setPdfUri(asset.uri || asset.localUri);
      setIsLoading(false);
    } catch (error) {
      console.error('PDF preparation error:', error);
      Alert.alert('Hata', 'PDF yüklenemedi');
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

  return (
    <SafeAreaView style={styles.container}>
      {pdfUri ? (
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
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          )}
        />
      ) : (
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
    width: width,
    height: height,
  },
});

export default PDFViewerScreen;
