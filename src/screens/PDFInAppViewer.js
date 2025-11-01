import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { Colors, Spacing, Typography } from '../constants/theme';

const { width, height } = Dimensions.get('window');

export default function PDFInAppViewer({ navigation, route }) {
  const { pdfUri } = route.params || {};
  const webviewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const goBack = () => navigation.goBack();

  const onLoadEnd = () => {
    setLoading(false);
  };

  const setPage = (page) => {
    if (!webviewRef.current) return;
    setCurrentPage(page);
    // Inject JS to change iframe src to the requested page fragment
    const js = `
      (function(){
        try {
          var f = document.getElementById('pdf');
          if(f) { 
            var newUrl = '${pdfUri}#page=${page}';
            console.log('Setting PDF page to:', newUrl);
            f.src = newUrl;
          }
        } catch(e) {
          console.error('Page change error:', e);
        }
        true;
      })();
    `;
    webviewRef.current.injectJavaScript(js);
  };

  const goPrev = () => {
    if (currentPage > 1) setPage(currentPage - 1);
  };

  const goNext = () => {
    setPage(currentPage + 1);
  };

  const injectedHTML = `
  <!doctype html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=3">
      <style>
        html,body{height:100%;margin:0;padding:0;background:#fff;overflow:hidden}
        iframe{border:0;width:100%;height:100vh;display:block}
        #loading{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#666}
      </style>
    </head>
    <body>
      <div id="loading">PDF yükleniyor...</div>
      <iframe id="pdf" src="${pdfUri}#page=1" onload="document.getElementById('loading').style.display='none'"></iframe>
      <script>
        console.log('PDF HTML loaded, initial URI:', '${pdfUri}#page=1');
      </script>
    </body>
  </html>
  `;

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
            <Text style={styles.loadingText}>Yükleniyor...</Text>
          </View>
        )}

        <WebView
          ref={webviewRef}
          originWhitelist={["*"]}
          source={{ html: injectedHTML }}
          onLoadEnd={onLoadEnd}
          onMessage={(event) => {
            console.log('WebView message:', event.nativeEvent.data);
          }}
          allowFileAccess
          allowUniversalAccessFromFileURLs
          mixedContentMode="compatibility"
          javaScriptEnabled={true}
          domStorageEnabled={true}
          style={styles.webview}
          startInLoadingState
        />

        {/* Simple controls */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={goPrev} style={styles.controlButton}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>

          <View style={styles.pageIndicator}>
            <Text style={styles.pageIndicatorText}>{currentPage}</Text>
          </View>

          <TouchableOpacity onPress={goNext} style={styles.controlButton}>
            <Ionicons name="chevron-forward" size={22} color="#fff" />
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
  pageIndicator: { paddingHorizontal: 8, justifyContent: 'center' },
  pageIndicatorText: { color: '#fff', fontWeight: '600' },
});
