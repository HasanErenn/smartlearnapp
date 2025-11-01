import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  Alert,
  Dimensions,
  ActivityIndicator,
  Platform
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Asset } from 'expo-asset';

import { Colors, Spacing, Typography } from '../constants/theme';

const { width, height } = Dimensions.get('window');

export default function PDFViewerScreen({ route, navigation }) {
  const { category } = route.params;
  const [pdfUri, setPdfUri] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPDF, setShowPDF] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(188); // PDF'nin gerçek sayfa sayısı
  const [webViewKey, setWebViewKey] = useState(0);
  const [pdfJsReady, setPdfJsReady] = useState(false);
  const webViewRef = React.useRef(null);

  useEffect(() => {
    preparePDF();
  }, []);

  // Sayfa navigasyonu fonksiyonları - PDF.js tarafından yönetiliyor
  const goToNextPage = () => {
    // PDF.js WebView içinde nextPage() fonksiyonu çağrılacak
    console.log('Next page requested via native button');
  };

  const goToPreviousPage = () => {
    // PDF.js WebView içinde previousPage() fonksiyonu çağrılacak
    console.log('Previous page requested via native button');
  };

  const preparePDF = async () => {
    try {
      setIsLoading(true);
      console.log('Preparing PDF for WebView...');
      
      // Direkt asset dosya yolunu kullan
      const assetPath = require('../../assets/ebooks/pdfs/ebook.pdf');
      console.log('Asset path:', assetPath);
      
      // Asset resolver ile gerçek URI'yi al
      const Asset = require('expo-asset').Asset;
      const asset = Asset.fromModule(assetPath);
      
      if (!asset.downloaded) {
        console.log('Downloading asset...');
        await asset.downloadAsync();
      }
      
      console.log('Asset URI:', asset.uri);
      console.log('Asset local URI:', asset.localUri);
      
      // WebView için HTTP URI kullan (file:// protokolü WebView'da çalışmıyor)
      const pdfURI = asset.uri; // HTTP URL kullan, localUri değil
      setPdfUri(pdfURI);
      
      console.log('PDF ready for WebView at:', pdfURI);
      console.log('Using HTTP URI instead of file:// for WebView compatibility');
      setIsLoading(false);
    } catch (error) {
      console.log('PDF preparation error:', error);
      setIsLoading(false);
      
      // Fallback: Direkt asset modülünü kullan
      try {
        const fallbackAsset = require('../../assets/ebooks/pdfs/ebook.pdf');
        setPdfUri(fallbackAsset);
        console.log('Using fallback asset:', fallbackAsset);
      } catch (fallbackError) {
        Alert.alert('Error', 'Could not load PDF file');
      }
    }
  };

  const openPDF = () => {
    console.log('Open PDF button clicked');
    console.log('PDF URI:', pdfUri);
    
    if (!pdfUri) {
      Alert.alert('Error', 'PDF not ready yet');
      return;
    }

    // PDF'i WebView ile aç
    setShowPDF(true);
  };

  const closePDF = () => {
    setShowPDF(false);
  };

  // PDF WebView için HTML content generator
  const generatePDFHTML = () => {
    console.log('Generating PDF HTML with URI:', pdfUri);
    
    // Test için basit HTML döndür
    if (!pdfUri || typeof pdfUri === 'number') {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              margin: 0; padding: 20px; 
              background: linear-gradient(135deg, #FF8629 0%, #FFB54A 100%);
              font-family: -apple-system, BlinkMacSystemFont, sans-serif;
              color: white; text-align: center; min-height: 100vh;
            }
            .container { padding: 40px 20px; }
            h1 { font-size: 28px; margin-bottom: 20px; }
            .feature { background: rgba(255,255,255,0.2); padding: 15px; margin: 10px 0; border-radius: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>📚 Smart Learn E-Book</h1>
            <p>PDF is being prepared...</p>
            <div class="feature">📖 Interactive Content</div>
            <div class="feature">📱 Mobile Friendly</div>
            <div class="feature">💾 Offline Access</div>
          </div>
        </body>
        </html>
      `;
    }
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0, user-scalable=yes">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            background: #f5f5f5;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            overflow: hidden;
          }
          .pdf-container {
            width: 100vw;
            height: 100vh;
            position: relative;
          }
          .pdf-frame {
            width: 100%;
            height: calc(100vh - 70px);
            border: none;
            background: white;
          }
          .navigation-bar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 70px;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 20px;
            z-index: 1000;
          }
          .nav-btn {
            background: #FF8629;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.3s;
            min-width: 80px;
          }
          .nav-btn:hover {
            background: #e5751f;
          }
          .nav-btn:disabled {
            background: #666;
            cursor: not-allowed;
          }
          .page-info {
            color: white;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            flex: 1;
            margin: 0 15px;
          }
          .fallback-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            padding: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            max-width: 300px;
          }
          .fallback-content h3 {
            color: #333;
            margin-bottom: 10px;
            font-size: 18px;
          }
          .fallback-content p {
            color: #666;
            margin-bottom: 15px;
            line-height: 1.4;
          }
          .download-btn {
            display: inline-block;
            background: #FF8629;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            transition: background 0.2s;
          }
          .download-btn:hover {
            background: #e5751f;
          }
        </style>
      </head>
      <body>
        <div class="pdf-container">
          <iframe 
            id="pdfFrame"
            class="pdf-frame"
            src="${pdfUri}#page=${currentPage}&zoom=100"
            title="Smart Learn E-Book"
          ></iframe>
          
          <div class="navigation-bar">
            <button class="nav-btn" onclick="previousPage()" id="prevBtn">◀ Önceki</button>
            <div class="page-info" id="pageInfo">Sayfa ${currentPage} / 188</div>
            <button class="nav-btn" onclick="nextPage()" id="nextBtn">Sonraki ▶</button>
          </div>
        </div>
        
        <script>
          let currentPage = ${currentPage};
          const totalPages = 188;
          
          console.log('PDF WebView initialized for page', currentPage);
          console.log('PDF URI: ${pdfUri}');
          
          // Sayfa navigasyonu
          function previousPage() {
            if (currentPage <= 1) {
              return;
            }
            currentPage--;
            updatePDF();
            updatePageInfo();
            sendMessage('pageChanged', currentPage);
          }
          
          function nextPage() {
            if (currentPage >= totalPages) {
              return;
            }
            currentPage++;
            updatePDF();
            updatePageInfo();
            sendMessage('pageChanged', currentPage);
          }
          
          function updatePDF() {
            const iframe = document.getElementById('pdfFrame');
            const newSrc = '${pdfUri}#page=' + currentPage + '&zoom=100';
            iframe.src = newSrc;
            console.log('Navigated to page', currentPage, 'with URL:', newSrc);
          }
          
          function updatePageInfo() {
            document.getElementById('pageInfo').textContent = 
              'Sayfa ' + currentPage + ' / ' + totalPages;
            
            document.getElementById('prevBtn').disabled = (currentPage <= 1);
            document.getElementById('nextBtn').disabled = (currentPage >= totalPages);
          }
          
          // React Native ile mesajlaşma
          function sendMessage(type, data) {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: type,
                data: data
              }));
            }
          }
          
          // Touch gestures
          let touchStartX = 0;
          let touchEndX = 0;
          
          document.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
          });
          
          document.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
          });
          
          function handleSwipe() {
            if (touchEndX < touchStartX - 50) {
              nextPage(); // Sola kaydırma = sonraki sayfa
            }
            if (touchEndX > touchStartX + 50) {
              previousPage(); // Sağa kaydırma = önceki sayfa
            }
          }
          
          // Klavye desteği
          document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
              previousPage();
            } else if (e.key === 'ArrowRight') {
              nextPage();
            }
          });
          
          // İlk yükleme
          document.addEventListener('DOMContentLoaded', function() {
            updatePageInfo();
            console.log('PDF viewer ready for 188 pages');
          });
        </script>
      </body>
      </html>
    `;
  };

  const sharePDF = async () => {
    console.log('Share PDF button clicked');
    
    if (!pdfUri) {
      Alert.alert('Error', 'PDF not ready yet');
      return;
    }

    try {
      // React Native için Expo Sharing kullan
      const canShare = await Sharing.isAvailableAsync();
      console.log('Sharing available:', canShare);
      
      if (canShare) {
        await Sharing.shareAsync(pdfUri.toString(), {
          mimeType: 'application/pdf',
          dialogTitle: 'Share Smart Learn E-Book Collection'
        });
      } else {
        // Fallback: Copy to clipboard message
        Alert.alert(
          'Share PDF', 
          `PDF Location: ${pdfUri}\n\nThis file is stored in your device's app folder.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.log('PDF share error:', error);
      Alert.alert('Error', `Could not share PDF: ${error.message}`);
    }
  };

  // PDF WebView modunda mı?
  if (showPDF && pdfUri) {
    return (
      <SafeAreaView style={styles.container}>
        {/* PDF Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={closePDF}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Smart Learn E-Book</Text>
          
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={sharePDF}
          >
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* PDF WebView */}
        <View style={styles.pdfWebViewContainer}>
          <WebView
            ref={webViewRef}
            key={webViewKey}
            source={{ html: generatePDFHTML() }}
            style={styles.webView}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={true}
            onMessage={(event) => {
              try {
                const message = JSON.parse(event.nativeEvent.data);
                console.log('Received message from WebView:', message);
                
                if (message.type === 'pageChanged') {
                  console.log('Page changed to:', message.data);
                  setCurrentPage(message.data);
                }
              } catch (error) {
                console.log('WebView message parse error:', error);
              }
            }}
            renderLoading={() => (
              <View style={styles.webViewLoadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Loading PDF...</Text>
              </View>
            )}
            onError={(error) => {
              console.log('WebView error:', error.nativeEvent);
            }}
            onLoad={() => {
              console.log('WebView PDF loaded successfully');
            }}
          />
          
          {/* Navigation Controls */}
          <View style={styles.navigationBar}>
            <TouchableOpacity 
              style={[styles.navButton, currentPage <= 1 && styles.navButtonDisabled]}
              onPress={() => {
                // WebView'a JavaScript kodu inject et
                webViewRef.current?.injectJavaScript('previousPage(); true;');
              }}
              disabled={currentPage <= 1}
            >
              <Text style={[styles.navButtonText, currentPage <= 1 && styles.navButtonTextDisabled]}>
                ◀ Önceki
              </Text>
            </TouchableOpacity>
            
            <View style={styles.pageIndicator}>
              <Text style={styles.pageText}>
                Sayfa {currentPage} / {totalPages}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.navButton, currentPage >= totalPages && styles.navButtonDisabled]}
              onPress={() => {
                // WebView'a JavaScript kodu inject et
                webViewRef.current?.injectJavaScript('nextPage(); true;');
              }}
              disabled={currentPage >= totalPages}
            >
              <Text style={[styles.navButtonText, currentPage >= totalPages && styles.navButtonTextDisabled]}>
                Sonraki ▶
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>E-Book Collection</Text>
        
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={sharePDF}
          disabled={!pdfUri}
        >
          <Text style={[styles.shareButtonText, !pdfUri && styles.disabledText]}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Preparing PDF...</Text>
          </View>
        ) : (
          <View style={styles.pdfInfoContainer}>
            <View style={styles.pdfIcon}>
              <Text style={styles.pdfIconText}>📚</Text>
            </View>
            
            <Text style={styles.pdfTitle}>Smart Learn E-Book Collection</Text>
            <Text style={styles.pdfDescription}>
              Complete digital learning resources and educational materials
            </Text>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.primaryButton, !pdfUri && styles.disabledButton]}
                onPress={() => {
                  console.log('Primary button pressed');
                  openPDF();
                }}
                disabled={!pdfUri}
                activeOpacity={0.7}
              >
                <Text style={[styles.primaryButtonText, !pdfUri && styles.disabledButtonText]}>
                  📖 Open PDF {!pdfUri ? '(Loading...)' : ''}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.secondaryButton, !pdfUri && styles.disabledSecondaryButton]}
                onPress={() => {
                  console.log('Share button pressed');
                  sharePDF();
                }}
                disabled={!pdfUri}
                activeOpacity={0.7}
              >
                <Text style={[styles.secondaryButtonText, !pdfUri && styles.disabledText]}>
                  📤 Share PDF
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>📋 PDF Features</Text>
              <Text style={styles.infoItem}>• Interactive educational content</Text>
              <Text style={styles.infoItem}>• Multi-page learning materials</Text>
              <Text style={styles.infoItem}>• Offline access capability</Text>
              <Text style={styles.infoItem}>• Print-friendly format</Text>
            </View>
          </View>
        )}
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: Spacing.sm,
  },
  backButtonText: {
    fontSize: Typography.sizes.medium,
    fontFamily: Typography.families.body,
    color: Colors.primary,
    fontWeight: Typography.weights.medium,
  },
  headerTitle: {
    fontSize: Typography.sizes.large,
    fontFamily: Typography.families.subtitle,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  shareButton: {
    padding: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  shareButtonText: {
    fontSize: Typography.sizes.medium,
    fontFamily: Typography.families.body,
    color: Colors.surface,
    fontWeight: Typography.weights.medium,
  },
  disabledText: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: Typography.sizes.medium,
    fontFamily: Typography.families.body,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  pdfInfoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  pdfIconText: {
    fontSize: 48,
  },
  pdfTitle: {
    fontSize: Typography.sizes.xlarge,
    fontFamily: Typography.families.subtitle,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  pdfDescription: {
    fontSize: Typography.sizes.medium,
    fontFamily: Typography.families.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 24,
  },
  actionButtons: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  disabledButton: {
    backgroundColor: Colors.textSecondary,
    opacity: 0.6,
  },
  primaryButtonText: {
    fontSize: Typography.sizes.large,
    fontFamily: Typography.families.body,
    fontWeight: Typography.weights.bold,
    color: Colors.surface,
  },
  disabledButtonText: {
    opacity: 0.8,
  },
  secondaryButton: {
    backgroundColor: Colors.backgroundLight,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  disabledSecondaryButton: {
    borderColor: Colors.textSecondary,
    opacity: 0.6,
  },
  secondaryButtonText: {
    fontSize: Typography.sizes.medium,
    fontFamily: Typography.families.body,
    fontWeight: Typography.weights.medium,
    color: Colors.primary,
  },
  infoBox: {
    width: '100%',
    backgroundColor: Colors.backgroundLight,
    padding: Spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoTitle: {
    fontSize: Typography.sizes.medium,
    fontFamily: Typography.families.body,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  infoItem: {
    fontSize: Typography.sizes.medium,
    fontFamily: Typography.families.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
  pdfWebViewContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  webViewLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
  },
  navigationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  navButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  navButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  navButtonText: {
    color: '#fff',
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.semibold,
  },
  navButtonTextDisabled: {
    color: '#999',
  },
  pageIndicator: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: Spacing.md,
  },
  pageText: {
    color: '#fff',
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
  },
});