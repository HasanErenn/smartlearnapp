import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/screens/SplashScreen';

// Prevent splash screen from hiding until fonts are loaded
ExpoSplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Roboto': Roboto_400Regular,
    'Roboto-Bold': Roboto_700Bold,
  });
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        if (fontsLoaded) {
          await ExpoSplashScreen.hideAsync();
        }
      } catch (error) {
        console.log('Splash screen hide error:', error);
      }
    };
    
    initApp();
  }, [fontsLoaded]);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (!fontsLoaded) {
    return null; // Show expo splash screen while loading fonts
  }

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }
  return (
    <>
      <AppNavigator />
      <StatusBar style="auto" />
    </>
  );
}
