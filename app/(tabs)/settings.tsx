import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../i18n';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants';

export default function SettingsScreen() {
  const { t, locale, setLocale } = useI18n();

  const toggleLanguage = () => {
    setLocale(locale === 'vi' ? 'en' : 'vi');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Language */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.settings.language}</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={toggleLanguage}>
          <Ionicons name="language-outline" size={24} color={Colors.light.text} />
          <View style={styles.menuContent}>
            <Text style={styles.menuText}>{t.settings.language}</Text>
            <Text style={styles.menuValue}>
              {locale === 'vi' ? 'Tiếng Việt' : 'English'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.light.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.settings.notifications}</Text>
        
        <View style={styles.menuItem}>
          <Ionicons name="notifications-outline" size={24} color={Colors.light.text} />
          <Text style={styles.menuText}>Thông báo RFQ mới</Text>
          <Switch
            value={true}
            onValueChange={() => {}}
            trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
          />
        </View>

        <View style={styles.menuItem}>
          <Ionicons name="mail-outline" size={24} color={Colors.light.text} />
          <Text style={styles.menuText}>Email thông báo</Text>
          <Switch
            value={false}
            onValueChange={() => {}}
            trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
          />
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.settings.about}</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="information-circle-outline" size={24} color={Colors.light.text} />
          <Text style={styles.menuText}>{t.settings.about}</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.light.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="document-outline" size={24} color={Colors.light.text} />
          <Text style={styles.menuText}>Điều khoản sử dụng</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.light.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="shield-checkmark-outline" size={24} color={Colors.light.text} />
          <Text style={styles.menuText}>Chính sách bảo mật</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.light.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="help-circle-outline" size={24} color={Colors.light.text} />
          <Text style={styles.menuText}>Hỗ trợ</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.light.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Version */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>
          {t.settings.version}: 1.0.0
        </Text>
        <Text style={styles.copyrightText}>
          © 2026 ViRFQ. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  section: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  menuItem: {
    backgroundColor: Colors.light.surface,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  menuContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  menuText: {
    flex: 1,
    marginLeft: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.light.text,
  },
  menuValue: {
    fontSize: FontSize.sm,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  versionContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  versionText: {
    fontSize: FontSize.sm,
    color: Colors.light.textMuted,
  },
  copyrightText: {
    fontSize: FontSize.xs,
    color: Colors.light.textMuted,
    marginTop: Spacing.xs,
  },
});
