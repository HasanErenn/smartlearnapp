import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  Dimensions, 
  StatusBar,
  Image 
} from 'react-native';
import { Typography, Colors } from '../constants/theme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const bottomFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations sequence
    Animated.sequence([
      // First: Center logo appears
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
      // Then: Bottom logos fade in
      Animated.timing(bottomFadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to main app after 2 seconds
    const timer = setTimeout(() => {
      console.log('SplashScreen: Calling onFinish()');
      onFinish();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Center Logo */}
      <Animated.View 
        style={[
          styles.centerLogoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <Image 
          source={require('../../assets/acilisgorsel.png')}
          style={styles.centerLogo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Bottom Sponsors/Partners */}
      <Animated.View 
        style={[
          styles.bottomContainer,
          { opacity: bottomFadeAnim }
        ]}
      >
        {/* Left - Turkey-EU Flag */}
        <View style={styles.leftLogoContainer}>
          <Image 
            source={require('../../assets/gorsel2.png')}
            style={styles.flagImage}
            resizeMode="contain"
          />
        </View>

        {/* Center - EU Funded Logo */}
        <View style={styles.centerBottomContainer}>
          <Image 
            source={require('../../assets/gorsel3.png')}
            style={styles.euLogo}
            resizeMode="contain"
          />
        </View>

        {/* Right - Turkish National Agency */}
        <View style={styles.rightLogoContainer}>
          <Image 
            source={require('../../assets/gorsel4.png')}
            style={styles.agencyLogo}
            resizeMode="contain"
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerLogoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  centerLogo: {
    width: width * 0.7,
    height: height * 0.4,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftLogoContainer: {
    flex: 0.3,
    alignItems: 'flex-start',
  },
  centerBottomContainer: {
    flex: 0.4,
    alignItems: 'center',
  },
  rightLogoContainer: {
    flex: 0.3,
    alignItems: 'flex-end',
  },
  flagImage: {
    width: 100,
    height: 60,
  },
  euLogo: {
    width: 140,
    height: 80,
  },
  agencyLogo: {
    width: 120,
    height: 70,
  },
});