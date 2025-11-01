import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { Colors, Spacing, Typography } from '../constants/theme';

const { width, height } = Dimensions.get('window');

export default function PDFInAppViewerScroll({ navigation, route }) {
  const { pdfUri } = route.params || {};
  const webviewRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const goBack = () => navigation.goBack();

  const onLoadEnd = () => {
    setLoading(false);
  };

  // Direct PDF loading without iframe wrapper
  const directHTML = null; // We'll use source directly

  const onMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'scroll') {
        console.log('Scroll position:', data.percent + '%');
      }
    } catch (e) {
      // Ignore parse errors
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Simple header */}
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
            <Text style={styles.loadingText}>Kitap yükleniyor...</Text>
          </View>
        )}

        <WebView
          ref={webviewRef}
          originWhitelist={["*"]}
          source={{ uri: pdfUri }}
          onLoadEnd={onLoadEnd}
          onMessage={onMessage}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          mixedContentMode="compatibility"
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scrollEnabled={true}
          showsVerticalScrollIndicator={true}
          bounces={true}
          scalesPageToFit={true}
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
});