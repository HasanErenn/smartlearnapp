import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
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

        {/* Project Info Section */}
        <View style={styles.section}>
          {/* Smart Learn Logo at the top */}
          <View style={styles.topLogoContainer}>
            <Image 
              source={require('../../assets/logos/smartlearnlogo.png')} 
              style={styles.topLogo}
              resizeMode="contain"
            />
          </View>
          
          <Text style={styles.projectTitle}>THE MAGIC OF NUMBERS AND LETTERS: TECHNOLOGY AS A LEARNING AID PROJECT</Text>
          <Text style={styles.projectNumber}>PROJECT NUMBER:</Text>
          <Text style={styles.projectNumber}></Text>
          <Text style={styles.projectNumber}>2023-1-TR01-KA220-YOU-000161512</Text>

        </View>

        {/* EU Support Logos Section */}
        <View style={styles.section}>
          <View style={styles.logoRow}>
            <Image 
              source={require('../../assets/logos/abfon.png')} 
              style={styles.supportLogo}
              resizeMode="contain"
            />
            <Image 
              source={require('../../assets/logos/trab.png')} 
              style={styles.supportLogo}
              resizeMode="contain"
            />
            <Image 
              source={require('../../assets/logos/ulusalajans.png')} 
              style={styles.supportLogo}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Aim Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aim of the Project</Text>
          <Text style={styles.sectionText}>
            The aim is to strengthen and digitize the primary school curriculum through non-formal and experiential learning-based methodologies, thereby enhancing students' learning experiences. These methodologies, which include the integration of digital technologies alongside traditional classroom settings, aim to diversify students' learning processes and provide a more effective learning environment.
          </Text>
          <Text style={styles.sectionText}>
            In this context, the e-book contains guidelines that can be used in primary school curricula. There are over 30 guides covering 7 different subjects.
          </Text>
          <Text style={styles.sectionText}>
            Primary school teachers can use these guidelines to conduct classroom education in a way that is suitable for non-formal learning, experience-based, and digitized.
          </Text>
          <Text style={styles.sectionText}>
            These guides were developed and digitized by teachers as part of the Smart Learn Project.
          </Text>
        </View>

        {/* Partners Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Partners</Text>
          
          <Text style={styles.partnerTitle}>PROJECT COORDINATOR</Text>
          <Text style={styles.partnerText}>(TURKEY) SOCIAL DEVELOPMENT CENTER EDUCATION AND SOCIAL SOLIDARITY ASSOCIATION (TOGEMDER)</Text>
          <View style={styles.coordinatorLogoContainer}>
            <Image 
              source={require('../../assets/logos/togemlogo.png')} 
              style={styles.coordinatorLogo}
              resizeMode="contain"
            />
          </View>
          
          <Text style={styles.partnerTitle}>PARTNERS</Text>
          <Text style={styles.partnerText}>(NORTH MACEDONIA) YOUTH EMPOWERMENT ASSOCIATION</Text>
          <Text style={styles.partnerText}>(CROATIA) INSTITUTE OF YOUTH POWER</Text>
          <Text style={styles.partnerText}>(SPAIN) ASOCIATION AMIGOS DE EUROPA</Text>
          
          {/* Partner Logos */}
          <View style={styles.logoRow}>
            <Image 
              source={require('../../assets/logos/yealogo.png')} 
              style={styles.partnerLogo}
              resizeMode="contain"
            />
            <Image 
              source={require('../../assets/logos/iyplogo.png')} 
              style={styles.partnerLogo}
              resizeMode="contain"
            />
            <Image 
              source={require('../../assets/logos/amigoslogo.png')} 
              style={styles.partnerLogo}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Disclaimer Section */}
        <View style={styles.section}>
          <Text style={styles.disclaimerText}>
            The European Commission's support to produce this publication does not constitute an endorsement of the contents, which reflects the views only of the authors, and the Commission cannot be held responsible for any use which may be made of the information contained therein.
          </Text>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.contactItem}>Phone Number</Text>
          <Text style={styles.contactItem}>Email@gmail.com</Text>
          <Text style={styles.contactItem}>Address</Text>
        </View>

        {/* Social Media Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Follow Us</Text>
          <View style={styles.socialMediaContainer}>
            
            <TouchableOpacity 
              style={styles.socialMediaButton}
              onPress={() => Linking.openURL('https://www.instagram.com/smartlearn2005')}
            >
              <Text style={styles.socialMediaIcon}>📷</Text>
              <Text style={styles.socialMediaText}>Instagram</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.socialMediaButton}
              onPress={() => Linking.openURL('https://www.facebook.com/61560378629575')}
            >
              <Text style={styles.socialMediaIcon}>📘</Text>
              <Text style={styles.socialMediaText}>Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.socialMediaButton}
              onPress={() => Linking.openURL('https://www.tiktok.com/@smart.learn2005')}
            >
              <Text style={styles.socialMediaIcon}>🎵</Text>
              <Text style={styles.socialMediaText}>TikTok</Text>
            </TouchableOpacity>

          </View>
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
    textAlign: 'center',
  },
  sectionText: {
    fontSize: Typography.sizes.medium,
    fontFamily: Typography.families.body,
    color: Colors.textSecondary,
    lineHeight: 24,
    textAlign: 'justify',
  },
  contactItem: {
    fontSize: Typography.sizes.medium,
    fontFamily: Typography.families.body,
    color: Colors.text,
    marginBottom: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  projectTitle: {
    fontSize: Typography.sizes.medium,
    fontFamily: Typography.families.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  projectNumber: {
    fontSize: Typography.sizes.small,
    fontFamily: Typography.families.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: Typography.weights.medium,
  },
  partnerTitle: {
    fontSize: Typography.sizes.medium,
    fontFamily: Typography.families.body,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  partnerText: {
    fontSize: Typography.sizes.small,
    fontFamily: Typography.families.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    lineHeight: 18,
    textAlign: 'justify',
  },
  disclaimerText: {
    fontSize: Typography.sizes.small,
    fontFamily: Typography.families.body,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    lineHeight: 20,
    textAlign: 'justify',
  },
  topLogoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  topLogo: {
    width: 160,
    height: 110,
  },
  logoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  partnerLogo: {
    width: 90,
    height: 60,
    margin: Spacing.xs,
  },
  supportLogo: {
    width: 100,
    height: 65,
    margin: Spacing.xs,
  },
  coordinatorLogoContainer: {
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  coordinatorLogo: {
    width: 120,
    height: 75,
  },
  socialMediaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  socialMediaButton: {
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 12,
    backgroundColor: Colors.backgroundLight,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 80,
  },
  socialMediaIcon: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  socialMediaText: {
    fontSize: Typography.sizes.small,
    fontFamily: Typography.families.body,
    fontWeight: Typography.weights.medium,
    color: Colors.text,
    textAlign: 'center',
  },
});