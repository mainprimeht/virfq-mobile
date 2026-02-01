import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadows } from '../../constants';

type IconName = keyof typeof Ionicons.glyphMap;

interface MenuItemProps {
  icon: IconName;
  label: string;
  onPress: () => void;
  showArrow?: boolean;
  danger?: boolean;
}

function MenuItem({ icon, label, onPress, showArrow = true, danger = false }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
        <Ionicons 
          name={icon} 
          size={20} 
          color={danger ? Colors.error[600] : Colors.slate[600]} 
        />
      </View>
      <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
      {showArrow && (
        <Ionicons name="chevron-forward" size={20} color={Colors.slate[400]} />
      )}
    </TouchableOpacity>
  );
}

export default function MenuScreen() {
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Đăng xuất', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          }
        },
      ]
    );
  };

  const planName = user?.subscription?.planName || 'FREE';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* User Info */}
      {isAuthenticated && user ? (
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name || 'Người dùng'}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={styles.planBadge}>
              <Text style={styles.planText}>{planName} Plan</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.loginPrompt}>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => router.push('/(auth)/login')}
          >
            <Ionicons name="person-circle-outline" size={48} color={Colors.primary[600]} />
            <Text style={styles.loginText}>Đăng nhập / Đăng ký</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Account Section */}
      {isAuthenticated && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tài khoản</Text>
          <View style={styles.menuGroup}>
            <MenuItem 
              icon="person-outline" 
              label="Hồ sơ cá nhân" 
              onPress={() => router.push('/profile')} 
            />
            <MenuItem 
              icon="lock-closed-outline" 
              label="Đổi mật khẩu" 
              onPress={() => router.push('/change-password')} 
            />
            <MenuItem 
              icon="people-outline" 
              label="Quản lý team" 
              onPress={() => Alert.alert('Sắp ra mắt', 'Tính năng này sẽ có trong phiên bản tiếp theo')} 
            />
            <MenuItem 
              icon="receipt-outline" 
              label="Lịch sử thanh toán" 
              onPress={() => Alert.alert('Sắp ra mắt', 'Tính năng này sẽ có trong phiên bản tiếp theo')} 
            />
          </View>
        </View>
      )}

      {/* Subscription Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gói dịch vụ</Text>
        <View style={styles.menuGroup}>
          <MenuItem 
            icon="diamond-outline" 
            label="Bảng giá" 
            onPress={() => router.push('/pricing')} 
          />
          <MenuItem 
            icon="gift-outline" 
            label="Nhập mã giảm giá" 
            onPress={() => Alert.alert('Nhập mã', 'Tính năng sẽ có trong phiên bản tiếp theo')} 
          />
        </View>
      </View>

      {/* Support Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hỗ trợ</Text>
        <View style={styles.menuGroup}>
          <MenuItem 
            icon="mail-outline" 
            label="Liên hệ" 
            onPress={() => Alert.alert('Liên hệ', 'Email: support@virfq.com')} 
          />
          <MenuItem 
            icon="help-circle-outline" 
            label="FAQ" 
            onPress={() => Alert.alert('FAQ', 'Xem tại virfq.com/faq')} 
          />
          <MenuItem 
            icon="document-text-outline" 
            label="Điều khoản sử dụng" 
            onPress={() => Alert.alert('Điều khoản', 'Xem tại virfq.com/terms')} 
          />
        </View>
      </View>

      {/* Logout */}
      {isAuthenticated && (
        <View style={styles.section}>
          <View style={styles.menuGroup}>
            <MenuItem 
              icon="log-out-outline" 
              label="Đăng xuất" 
              onPress={handleLogout}
              showArrow={false}
              danger
            />
          </View>
        </View>
      )}

      {/* Version */}
      <View style={styles.footer}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.slate[50],
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.slate[200],
    ...Shadows.sm,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: FontSize.h1,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  userInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  userName: {
    fontSize: FontSize.bodyLarge,
    fontWeight: FontWeight.semiBold,
    color: Colors.slate[900],
  },
  userEmail: {
    fontSize: FontSize.body,
    color: Colors.slate[500],
    marginTop: 2,
  },
  planBadge: {
    alignSelf: 'flex-start',
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    backgroundColor: Colors.primary[50],
    borderRadius: BorderRadius.sm,
  },
  planText: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.medium,
    color: Colors.primary[700],
  },
  loginPrompt: {
    margin: Spacing.lg,
    padding: Spacing['2xl'],
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.slate[200],
    ...Shadows.sm,
  },
  loginButton: {
    alignItems: 'center',
  },
  loginText: {
    fontSize: FontSize.bodyLarge,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary[600],
    marginTop: Spacing.md,
  },
  section: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.semiBold,
    color: Colors.slate[500],
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  menuGroup: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.slate[200],
    ...Shadows.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate[100],
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.slate[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIconDanger: {
    backgroundColor: Colors.error[50],
  },
  menuLabel: {
    flex: 1,
    marginLeft: Spacing.md,
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
    color: Colors.slate[700],
  },
  menuLabelDanger: {
    color: Colors.error[600],
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  versionText: {
    fontSize: FontSize.caption,
    color: Colors.slate[400],
  },
  bottomPadding: {
    height: Spacing['2xl'],
  },
});
