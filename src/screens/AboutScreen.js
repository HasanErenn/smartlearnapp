import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { Colors, Spacing, Typography } from '../constants/theme';

export default function AboutScreen({ navigation }) {

  return (
    <ScrollView style={globalStyles.container}>
      <View style={globalStyles.padding}>
        
        {/* App Logo/Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.appName}>Smart Learn</Text>
          </View>
          <Text style={styles.version}>v1.0.0</Text>
        </View>

        {/* Mission Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.sectionText}>
            Smart Learn supports digital transformation in education by ensuring that students of all ages can easily access quality educational materials. We offer personalized learning experiences by combining modern technology with traditional learning.
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureText}>• Comprehensive educational materials</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureText}>• Multi-language support</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureText}>• Age-appropriate content</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureText}>• Mobile-friendly design</Text>
            </View>
          </View>
        </View>

        {/* Team Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Team</Text>
          <Text style={styles.sectionText}>
            Our team of experienced educators, software developers and designers works continuously to provide the best learning experience.
          </Text>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <Text style={styles.sectionText}>
            You can contact us with your questions and suggestions. We would be happy to help you.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 Smart Learn. All rights reserved.
          </Text>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  logoEmoji: {
    fontSize: 64,
    marginBottom: Spacing.sm,
  },
  appName: {
    fontSize: Typography.sizes.xxlarge,
    fontWeight: Typography.weights.bold,
    fontFamily: Typography.families.title,
    color: Colors.primary,
    textAlign: 'center',
  },
  version: {
    fontSize: Typography.sizes.medium,
    fontFamily: Typography.families.body,
    color: Colors.textSecondary,
    backgroundColor: Colors.backgroundAlt,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 16,
  },
  section: {
    marginBottom: Spacing.xl,
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.bold,
    fontFamily: Typography.families.subtitle,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  sectionText: {
    fontSize: Typography.sizes.medium,
    fontFamily: Typography.families.body,
    color: Colors.textSecondary,
    lineHeight: 24,
    textAlign: 'left',
  },
  featuresList: {
    marginTop: Spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
    width: 32,
  },
  featureText: {
    fontSize: Typography.sizes.medium,
    fontFamily: Typography.families.body,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 22,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginTop: Spacing.lg,
  },
  footerText: {
    fontSize: Typography.sizes.small,
    fontFamily: Typography.families.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});