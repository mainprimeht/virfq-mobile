import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components';
import { useAuthStore } from '../../store';
import { useI18n } from '../../i18n';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants';

export default function ProfileScreen() {
  const { t } = useI18n();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  if (!isAuthenticated || !user) {
    return (
      <View style={styles.notLoggedIn}>
        <Ionicons name="person-circle-outline" size={80} color={Colors.light.textMuted} />
        <Text style={styles.notLoggedInText}>Bạn chưa đăng nhập</Text>
        <Button
          title={t.auth.login}
          onPress={() => router.push('/(auth)/login')}
          style={styles.loginButton}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* User Info Card */}
      <View style={styles.userCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={styles.userName}>{user.name || 'Người dùng'}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        {user.company && <Text style={styles.userCompany}>{user.company}</Text>}
      </View>

      {/* Subscription Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.profile.subscription}</Text>
        <View style={styles.subscriptionCard}>
          <View style={styles.subscriptionInfo}>
            <Text style={styles.planName}>
              {user.subscription?.planName || t.profile.freePlan}
            </Text>
            {user.trialInfo?.isInTrial && (
              <Text style={styles.trialInfo}>
                Dùng thử: còn {user.trialInfo.trialDaysRemaining} ngày
              </Text>
            )}
          </View>
          <Button
            title={t.profile.upgradePlan}
            variant="outline"
            size="sm"
            onPress={() => {}}
          />
        </View>
      </View>

      {/* Profile Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tài khoản</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="person-outline" size={24} color={Colors.light.text} />
          <Text style={styles.menuText}>Chỉnh sửa hồ sơ</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.light.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="lock-closed-outline" size={24} color={Colors.light.text} />
          <Text style={styles.menuText}>{t.profile.changePassword}</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.light.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="document-text-outline" size={24} color={Colors.light.text} />
          <Text style={styles.menuText}>Lịch sử mở khóa</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.light.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <View style={styles.logoutSection}>
        <Button
          title={t.auth.logout}
          variant="outline"
          onPress={handleLogout}
          style={styles.logoutButton}
          textStyle={styles.logoutButtonText}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  notLoggedIn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  notLoggedInText: {
    fontSize: FontSize.lg,
    color: Colors.light.textSecondary,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  loginButton: {
    width: '100%',
    maxWidth: 200,
  },
  userCard: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.xl,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  avatarContainer: {
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#fff',
  },
  userName: {
    fontSize: FontSize.xl,
    fontWeight: '600',
    color: Colors.light.text,
  },
  userEmail: {
    fontSize: FontSize.md,
    color: Colors.light.textSecondary,
    marginTop: Spacing.xs,
  },
  userCompany: {
    fontSize: FontSize.sm,
    color: Colors.light.textMuted,
    marginTop: Spacing.xs,
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
  subscriptionCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subscriptionInfo: {
    flex: 1,
  },
  planName: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.light.text,
  },
  trialInfo: {
    fontSize: FontSize.sm,
    color: Colors.light.secondary,
    marginTop: Spacing.xs,
  },
  menuItem: {
    backgroundColor: Colors.light.surface,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  menuText: {
    flex: 1,
    marginLeft: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.light.text,
  },
  logoutSection: {
    padding: Spacing.xl,
  },
  logoutButton: {
    borderColor: Colors.light.error,
  },
  logoutButtonText: {
    color: Colors.light.error,
  },
});
