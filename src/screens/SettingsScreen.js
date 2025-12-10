import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, Linking, Image } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { Colors, Spacing, Typography } from '../constants/theme';

export default function SettingsScreen({ navigation }) {
  const contactSupport = () => {
    const email = 'smartlearnmobile@gmail.com';
    const subject = 'Support Request - Smart Learn App';
    const body = 'Hello IT Team,\n\nI need assistance with:\n\n';
    
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.openURL(mailtoUrl).catch(() => {
      Alert.alert(
        'Contact IT Team',
        `Please send an email to: ${email}`,
        [{ text: 'OK', style: 'default' }]
      );
    });
  };

  const showPrivacyPolicy = () => {
    const privacyPolicyUrl = 'https://www.smartlearn.com.tr/privacy-policy-for-smart-learn-mobile-ap';
    
    Linking.openURL(privacyPolicyUrl).catch(() => {
      Alert.alert(
        'Error',
        'Unable to open Privacy Policy. Please check your internet connection.',
        [{ text: 'OK', style: 'default' }]
      );
    });
  };

  const showAbout = () => {
    Alert.alert(
      'Smart Learn',
      'Version 1.0.0\nThis application is completely free. If you encounter any errors or shortcomings, please contact us.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  return (
    <View style={globalStyles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={contactSupport}>
            <Image 
              source={require('../../assets/icons/mail-icon.png')} 
              style={styles.settingIcon}
            />
            <View style={styles.settingInfo}>
              <Text style={styles.settingName}>Contact with IT Team</Text>
              <Text style={styles.settingDescription}>smartlearnmobile@gmail.com</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={showPrivacyPolicy}>
            <Image 
              source={require('../../assets/icons/privacy-policy-icon.png')} 
              style={styles.settingIcon}
            />
            <View style={styles.settingInfo}>
              <Text style={styles.settingName}>Privacy Policy</Text>
              <Text style={styles.settingDescription}>How we protect your privacy</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={showAbout}>
            <Image 
              source={require('../../assets/icons/About.png')} 
              style={styles.settingIcon}
            />
            <View style={styles.settingInfo}>
              <Text style={styles.settingName}>About</Text>
              <Text style={styles.settingDescription}>App version and information</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: Typography.sizes.xxlarge,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: 12,
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  settingIcon: {
    width: 24,
    height: 24,
    marginRight: Spacing.md,
    tintColor: Colors.primary,
  },
  settingInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
    marginRight: Spacing.md,
  },
  settingName: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: Typography.sizes.small,
    color: Colors.textSecondary,
  },
  arrow: {
    fontSize: 24,
    color: Colors.textSecondary,
  },
});
