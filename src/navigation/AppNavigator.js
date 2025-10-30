import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { Image } from 'react-native';

// Import screens 
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import AboutScreen from '../screens/AboutScreen';
import CategoryDetailScreen from '../screens/CategoryDetailScreen';
import SearchResultsScreen from '../screens/SearchResultsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import EbookViewerScreen from '../screens/EbookViewerScreen';

// Import constants
import { SCREEN_NAMES } from '../constants/config';
import { Colors } from '../constants/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Tab Navigator Component
function TabNavigator() {
  const { t } = useTranslation();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
        },
        headerStyle: {
          backgroundColor: Colors.surface,
        },
        headerTintColor: Colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen 
        name={SCREEN_NAMES.HOME} 
        component={HomeScreen}
        options={{
          tabBarLabel: t('common.home'),
          title: 'Smart Learn',
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('../../assets/icons/Home_selected.png') : require('../../assets/icons/Home.png')}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen 
        name={SCREEN_NAMES.EXPLORE} 
        component={ExploreScreen}
        options={{
          tabBarLabel: t('common.explore'),
          title: t('common.explore'),
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('../../assets/icons/search_selected.png') : require('../../assets/icons/search.png')}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen 
        name={SCREEN_NAMES.ABOUT} 
        component={AboutScreen}
        options={{
          tabBarLabel: "About Us",
          title: "About Us",
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('../../assets/icons/About_selected.png') : require('../../assets/icons/About.png')}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen 
        name={SCREEN_NAMES.SETTINGS} 
        component={SettingsScreen}
        options={{
          tabBarLabel: t('common.settings'),
          title: t('settings.title'),
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('../../assets/icons/settings_selected.png') : require('../../assets/icons/settings.png')}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Main App Navigator
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // We'll use custom headers
        }}
      >
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen 
          name={SCREEN_NAMES.CATEGORY_DETAIL} 
          component={CategoryDetailScreen} 
        />
        <Stack.Screen 
          name={SCREEN_NAMES.SEARCH_RESULTS} 
          component={SearchResultsScreen} 
        />
        <Stack.Screen 
          name="EbookViewer" 
          component={EbookViewerScreen}
          options={{ headerShown: true, title: 'E-Kitap' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}