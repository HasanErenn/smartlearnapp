import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { Colors, Spacing, Typography } from '../constants/theme';

const { width, height } = Dimensions.get('window');

export default function PDFInAppViewerNative({ navigation, route }) {
  const { pdfUri, pdfLocalUri } = route.params || {};
  const webviewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const goBack = () => navigation.goBack();

  const onLoadEnd = () => {
    setLoading(false);
  };

  const onError = () => {
    setError(true);
    setLoading(false);
  };

  const onMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('WebView message:', data);
      
      if (data.type === 'pageChange') {
        setCurrentPage(data.page);
      } else if (data.type === 'error') {
        setError(true);
      }
    } catch (e) {
      // Ignore parse errors
    }
  };

  // Enhanced HTML with better PDF handling
  const enhancedHTML = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
      <style>
        * { 
          margin: 0; 
          padding: 0; 
          box-sizing: border-box; 
        }
        
        html, body {
          width: 100%;
          height: 100%;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
          background: #f5f5f5;
        }
        
        .container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: white;
        }
        
        .pdf-embed {
          flex: 1;
          width: 100%;
          min-height: 100vh;
          border: none;
          background: white;
        }
        
        .loading {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(255,255,255,0.9);
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          z-index: 1000;
        }
        
        .error {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          border: 1px solid #ddd;
          z-index: 1000;
        }
        
        .retry-btn {
          background: #007AFF;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          margin-top: 10px;
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <div id="loading" class="loading">
        <div>PDF yükleniyor...</div>
      </div>
      
      <div id="error" class="error" style="display: none;">
        <div>PDF yüklenemedi</div>
        <button class="retry-btn" onclick="retryLoad()">Tekrar Dene</button>
      </div>
      
      <div class="container">
        <embed 
          id="pdfEmbed"
          src="${pdfUri}" 
          type="application/pdf" 
          class="pdf-embed"
          onload="handleLoad()"
          onerror="handleError()">
      </div>
      
      <script>
        console.log('Loading PDF:', '${pdfUri}');
        
        let loadTimeout;
        let loadAttempts = 0;
        
        function handleLoad() {
          console.log('PDF loaded successfully');
          document.getElementById('loading').style.display = 'none';
          clearTimeout(loadTimeout);
          
          // Send success message
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'loaded',
              success: true
            }));
          }
        }
        
        function handleError() {
          console.log('PDF load error');
          loadAttempts++;
          
          if (loadAttempts < 2) {
            // Try with local URI
            document.getElementById('pdfEmbed').src = '${pdfLocalUri || pdfUri}';
            return;
          }
          
          document.getElementById('loading').style.display = 'none';
          document.getElementById('error').style.display = 'block';
          
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'error',
              message: 'PDF could not be loaded'
            }));
          }
        }
        
        function retryLoad() {
          document.getElementById('error').style.display = 'none';
          document.getElementById('loading').style.display = 'block';
          loadAttempts = 0;
          document.getElementById('pdfEmbed').src = '${pdfUri}';
        }
        
        // Set timeout for loading
        loadTimeout = setTimeout(() => {
          if (document.getElementById('loading').style.display !== 'none') {
            handleError();
          }
        }, 10000);
        
        // Enable smooth scrolling
        document.documentElement.style.scrollBehavior = 'smooth';
        
        // Track scroll position
        let scrollTimeout;
        window.addEventListener('scroll', function() {
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
            
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'scroll',
                percent: scrollPercent
              }));
            }
          }, 100);
        });
      </script>
    </body>
  </html>
  `;

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
          <Text style={styles.errorTitle}>PDF Görüntülenemedi</Text>
          <Text style={styles.errorMessage}>
            PDF dosyası şu anda görüntülenemiyor. Bu durumda react-native-pdf ile native görüntüleyici kullanmayı önerebiliriz.
          </Text>
          <TouchableOpacity onPress={() => setError(false)} style={styles.retryButton}>
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
        <View style={styles.headerRight} />
      </View>

      <View style={styles.viewerContainer}>
        {loading && (
          <View style={styles.loadingOverlay} pointerEvents="none">
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>PDF yükleniyor...</Text>
          </View>
        )}

        <WebView
          ref={webviewRef}
          originWhitelist={["*"]}
          source={{ html: enhancedHTML }}
          onLoadEnd={onLoadEnd}
          onError={onError}
          onMessage={onMessage}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          mixedContentMode="compatibility"
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scrollEnabled={true}
          showsVerticalScrollIndicator={true}
          bounces={true}
          scalesPageToFit={false}
          style={styles.webview}
          startInLoadingState={false}
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
  viewerContainer: { 
    flex: 1 
  },
  webview: { 
    flex: 1, 
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
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.95)'
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
    marginBottom: Spacing.lg,
    lineHeight: 22,
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