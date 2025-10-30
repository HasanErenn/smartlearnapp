import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { globalStyles } from '../styles/globalStyles';
import { Colors, Spacing, Typography } from '../constants/theme';

export default function SettingsScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const [settings, setSettings] = useState({
    autoUpdate: true,
  });
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const languages = [
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === i18n.language) || languages[0];
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setLanguageModalVisible(false);
  };

  const openLanguageModal = () => {
    setLanguageModalVisible(true);
  };

  const SettingItem = ({ title, description, value, onToggle, type = 'switch', flag, customContent }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {description && (
          <Text style={styles.settingDescription}>{description}</Text>
        )}
      </View>
      
      {type === 'switch' && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: Colors.border, true: Colors.primary + '50' }}
          thumbColor={value ? Colors.primary : Colors.textSecondary}
        />
      )}
      
      {type === 'button' && !customContent && (
        <View style={styles.buttonContainer}>
          {typeof value === 'string' && (
            <Text style={styles.buttonValue}>{value}</Text>
          )}
          <TouchableOpacity onPress={onToggle}>
            <Text style={styles.buttonText}>›</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {type === 'language' && (
        <TouchableOpacity onPress={onToggle} style={styles.languageButton}>
          <Text style={styles.flagText}>{flag}</Text>
          <Text style={styles.languageText}>{value}</Text>
          <Text style={styles.buttonText}>▼</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const LanguageModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={languageModalVisible}
      onRequestClose={() => setLanguageModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t('settings.select_language')}</Text>
          {languages.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={[
                styles.languageOption,
                i18n.language === language.code && styles.selectedLanguageOption
              ]}
              onPress={() => changeLanguage(language.code)}
            >
              <Text style={styles.flagText}>{language.flag}</Text>
              <Text style={[
                styles.languageOptionText,
                i18n.language === language.code && styles.selectedLanguageText
              ]}>
                {language.name}
              </Text>
              {i18n.language === language.code && (
                <Text style={styles.checkMark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setLanguageModalVisible(false)}
          >
            <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const handleAbout = () => {
    Alert.alert(
      'Hakkında',
      'MobileApp v1.0.0\n\nReact Native ile geliştirilmiştir.\n© 2024',
      [{ text: 'Tamam' }]
    );
  };

  const handleSupport = () => {
    Alert.alert(
      'Destek',
      'Yardım için: support@example.com',
      [{ text: 'Tamam' }]
    );
  };



  return (
    <ScrollView style={globalStyles.container}>
      <LanguageModal />
      <View style={globalStyles.padding}>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={globalStyles.subtitle}>{t('settings.app_settings')}</Text>
          
          <SettingItem
            title={t('settings.auto_update')}
            description={t('settings.auto_update_desc')}
            value={settings.autoUpdate}
            onToggle={() => toggleSetting('autoUpdate')}
          />
          
          <SettingItem
            title={t('settings.language')}
            description={t('settings.language_desc')}
            value={getCurrentLanguage().name}
            flag={getCurrentLanguage().flag}
            type="language"
            onToggle={openLanguageModal}
          />
        </View>

        {/* Information */}
        <View style={styles.section}>
          <Text style={globalStyles.subtitle}>{t('settings.info')}</Text>
          
          <SettingItem
            title={t('settings.about')}
            description={t('settings.about_desc')}
            type="button"
            onToggle={handleAbout}
          />
          
          <SettingItem
            title={t('settings.support')}
            description={t('settings.support_desc')}
            type="button"
            onToggle={handleSupport}
          />
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>{t('settings.app_info_title')}</Text>
            <Text style={styles.infoDescription}>
              {t('settings.app_info_desc')}
            </Text>
          </View>
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {t('common.version')} 1.0.0
          </Text>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.xl,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingContent: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingTitle: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.medium,
    fontFamily: Typography.families.subtitle,
    color: Colors.text,
    marginBottom: Spacing.xs / 2,
  },
  settingDescription: {
    fontSize: Typography.sizes.small,
    fontFamily: Typography.families.body,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonValue: {
    fontSize: Typography.sizes.small,
    color: Colors.textSecondary,
    marginRight: Spacing.sm,
  },
  buttonText: {
    fontSize: Typography.sizes.large,
    color: Colors.textSecondary,
  },
  infoContainer: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: Typography.sizes.xlarge,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  infoDescription: {
    fontSize: Typography.sizes.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  footerText: {
    fontSize: Typography.sizes.small,
    color: Colors.textSecondary,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 8,
    minWidth: 120,
  },
  flagText: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  languageText: {
    fontSize: Typography.sizes.small,
    color: Colors.text,
    marginRight: Spacing.sm,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.xl,
    width: '80%',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: 8,
    marginBottom: Spacing.xs,
  },
  selectedLanguageOption: {
    backgroundColor: Colors.primary + '20',
  },
  languageOptionText: {
    fontSize: Typography.sizes.medium,
    color: Colors.text,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  selectedLanguageText: {
    color: Colors.primary,
    fontWeight: Typography.weights.medium,
  },
  checkMark: {
    fontSize: Typography.sizes.medium,
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
  },
  cancelButton: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.border,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: Typography.sizes.medium,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
});