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
  const heartBeatAnim = useRef(new Animated.Value(1)).current;
  const finalZoomAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start initial animations
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
    ]).start(() => {
      // Start heartbeat animation after initial animation
      startHeartBeat();
    });

    // Navigate to main app after 5.5 seconds (includes zoom animation)
    const timer = setTimeout(() => {
      onFinish();
    }, 5500);

    return () => clearTimeout(timer);
  }, []);

  const startHeartBeat = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(heartBeatAnim, {
          toValue: 1.1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(heartBeatAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 3 } // Beat 3 times
    ).start(() => {
      // Start final zoom animation after heartbeat
      startFinalZoom();
    });
  };

  const startFinalZoom = () => {
    Animated.timing(finalZoomAnim, {
      toValue: 3, // 3x zoom - tamamen ekranı kaplayacak
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <Animated.View 
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: Animated.multiply(
                  Animated.multiply(scaleAnim, heartBeatAnim), 
                  finalZoomAnim
                )
              }
            ]
          }
        ]}
      >
        {/* Smart Learn Logo Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/acilisgorsel.png')}
            style={styles.logoImage}
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
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 400,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 350,
    height: 400,
  },
});