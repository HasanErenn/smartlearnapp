import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { Colors, Spacing, Typography } from '../constants/theme';

const { width, height } = Dimensions.get('window');

export default function PDFInAppViewerEnhanced({ navigation, route }) {
  const { pdfUri } = route.params || {};
  const webviewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfError, setPdfError] = useState(false);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const goBack = () => navigation.goBack();

  const onLoadEnd = () => {
    setLoading(false);
  };

  const onMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('WebView message:', data);
      
      if (data.type === 'pageChange') {
        setCurrentPage(data.page);
      } else if (data.type === 'totalPages') {
        setTotalPages(data.total);
      } else if (data.type === 'error') {
        console.error('PDF error:', data.message);
        setPdfError(true);
      }
    } catch (e) {
      console.log('Message parse error:', e);
    }
  };

  const changePage = (newPage) => {
    if (!webviewRef.current) return;
    
    const js = `
      if(window.pdfViewer && window.pdfViewer.currentPageNumber !== ${newPage}) {
        window.pdfViewer.currentPageNumber = ${newPage};
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'pageChange', 
          page: ${newPage}
        }));
      }
      true;
    `;
    webviewRef.current.injectJavaScript(js);
  };

  const goPrev = () => {
    if (currentPage > 1) changePage(currentPage - 1);
  };

  const goNext = () => {
    if (totalPages === 0 || currentPage < totalPages) changePage(currentPage + 1);
  };

  // Enhanced HTML with PDF.js
  const enhancedHTML = `
  <!doctype html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=3">
      <style>
        html, body { height: 100%; margin: 0; padding: 0; background: #fff; overflow: hidden; }
        #viewer { width: 100%; height: 100vh; }
        #fallback { width: 100%; height: 100vh; border: 0; }
        .loading { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #666; }
      </style>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.min.js"></script>
    </head>
    <body>
      <div id="loading" class="loading">PDF yükleniyor...</div>
      <canvas id="viewer" style="display:none;"></canvas>
      <iframe id="fallback" src="${pdfUri}#page=1" style="display:none;" onload="handleFallback()"></iframe>
      
      <script>
        let pdfDoc = null;
        let currentPage = 1;
        
        // PDF.js setup
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';
        
        async function loadPDF() {
          try {
            console.log('Loading PDF with PDF.js:', '${pdfUri}');
            
            pdfDoc = await pdfjsLib.getDocument('${pdfUri}').promise;
            
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'totalPages',
              total: pdfDoc.numPages
            }));
            
            window.pdfViewer = {
              get currentPageNumber() { return currentPage; },
              set currentPageNumber(page) {
                if(page >= 1 && page <= pdfDoc.numPages) {
                  currentPage = page;
                  renderPage(page);
                }
              }
            };
            
            document.getElementById('loading').style.display = 'none';
            document.getElementById('viewer').style.display = 'block';
            
            renderPage(1);
            
          } catch (error) {
            console.error('PDF.js failed:', error);
            handleFallback();
          }
        }
        
        async function renderPage(pageNum) {
          if (!pdfDoc) return;
          
          try {
            const page = await pdfDoc.getPage(pageNum);
            const canvas = document.getElementById('viewer');
            const context = canvas.getContext('2d');
            
            const viewport = page.getViewport({ scale: 1.0 });
            const scale = Math.min(window.innerWidth / viewport.width, window.innerHeight / viewport.height);
            const scaledViewport = page.getViewport({ scale });
            
            canvas.height = scaledViewport.height;
            canvas.width = scaledViewport.width;
            
            await page.render({
              canvasContext: context,
              viewport: scaledViewport
            }).promise;
            
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'pageChange',
              page: pageNum
            }));
            
          } catch (error) {
            console.error('Render error:', error);
          }
        }
        
        function handleFallback() {
          console.log('Using iframe fallback');
          document.getElementById('loading').style.display = 'none';
          document.getElementById('viewer').style.display = 'none';
          document.getElementById('fallback').style.display = 'block';
          
          // Fallback navigation for iframe
          window.pdfViewer = {
            get currentPageNumber() { return currentPage; },
            set currentPageNumber(page) {
              currentPage = page;
              document.getElementById('fallback').src = '${pdfUri}#page=' + page;
            }
          };
        }
        
        // Try PDF.js first, fallback to iframe
        loadPDF().catch(handleFallback);
      </script>
    </body>
  </html>
  `;

  if (pdfError) {
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
          <TouchableOpacity onPress={() => setPdfError(false)} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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
            <Text style={styles.loadingText}>Yükleniyor...</Text>
          </View>
        )}

        <WebView
          ref={webviewRef}
          originWhitelist={["*"]}
          source={{ html: enhancedHTML }}
          onLoadEnd={onLoadEnd}
          onMessage={onMessage}
          allowFileAccess
          allowUniversalAccessFromFileURLs
          mixedContentMode="compatibility"
          javaScriptEnabled={true}
          domStorageEnabled={true}
          style={styles.webview}
          startInLoadingState
        />

        <View style={styles.controls}>
          <TouchableOpacity onPress={goPrev} style={[styles.controlButton, currentPage <= 1 && styles.controlDisabled]}>
            <Ionicons name="chevron-back" size={22} color={currentPage <= 1 ? "#999" : "#fff"} />
          </TouchableOpacity>

          <View style={styles.pageIndicator}>
            <Text style={styles.pageIndicatorText}>
              {currentPage}{totalPages > 0 ? ` / ${totalPages}` : ''}
            </Text>
          </View>

          <TouchableOpacity onPress={goNext} style={[styles.controlButton, totalPages > 0 && currentPage >= totalPages && styles.controlDisabled]}>
            <Ionicons name="chevron-forward" size={22} color={totalPages > 0 && currentPage >= totalPages ? "#999" : "#fff"} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
  },
  headerButton: { padding: Spacing.xs },
  headerTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: '#333',
  },
  headerRight: { width: 40 },
  viewerContainer: { flex: 1 },
  webview: { flex: 1, backgroundColor: '#fff' },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.9)'
  },
  loadingText: { marginTop: Spacing.sm, color: '#666' },
  controls: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 24,
    padding: 6,
  },
  controlButton: { padding: 8 },
  controlDisabled: { opacity: 0.5 },
  pageIndicator: { paddingHorizontal: 8, justifyContent: 'center' },
  pageIndicatorText: { color: '#fff', fontWeight: '600', fontSize: 14 },
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
});