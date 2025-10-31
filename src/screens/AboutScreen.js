import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { Colors, Spacing, Typography } from '../constants/theme';

export default function AboutScreen({ navigation }) {

  return (
    <View style={styles.container}>
      {/* Header with white background */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.appName}>Smart Learn</Text>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={globalStyles.padding}>

        {/* Mission Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.sectionText}>
            Smart Learn supports digital transformation in education by ensuring that students of all ages can easily access quality educational materials. We offer personalized learning experiences by combining modern technology with traditional learning.
          </Text>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.contactItem}>Phone Number</Text>
          <Text style={styles.contactItem}>Email@gmail.com</Text>
          <Text style={styles.contactItem}>Address</Text>
        </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  logoContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: Typography.sizes.xxlarge,
    fontWeight: Typography.weights.bold,
    fontFamily: Typography.families.title,
    color: '#000000',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: Spacing.xl,
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
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
  contactItem: {
    fontSize: Typography.sizes.medium,
    fontFamily: Typography.families.body,
    color: Colors.text,
    marginBottom: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
});