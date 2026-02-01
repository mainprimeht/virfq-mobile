import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components';
import { useAuthStore } from '../../store';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadows } from '../../constants';

export default function DashboardScreen() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return (
      <View style={styles.notLoggedIn}>
        <Ionicons name="grid-outline" size={64} color={Colors.slate[300]} />
        <Text style={styles.notLoggedInTitle}>Dashboard</Text>
        <Text style={styles.notLoggedInText}>
          Đăng nhập để xem thống kê sử dụng
        </Text>
        <Button
          title="Đăng nhập"
          onPress={() => router.push('/(auth)/login')}
          style={styles.loginButton}
        />
      </View>
    );
  }

  const planName = user.subscription?.planName || 'FREE';
  const trialRemaining = user.trialInfo?.trialDaysRemaining || 0;
  const isInTrial = user.trialInfo?.isInTrial;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Greeting */}
      <View style={styles.greeting}>
        <Text style={styles.greetingText}>
          Xin chào, <Text style={styles.userName}>{user.name || 'bạn'}</Text>
        </Text>
      </View>

      {/* Plan Card */}
      <View style={styles.planCard}>
        <View style={styles.planHeader}>
          <View style={styles.planInfo}>
            <View style={styles.planBadge}>
              <Ionicons name="star" size={16} color={Colors.warning[500]} />
              <Text style={styles.planBadgeText}>Gói: {planName}</Text>
            </View>
            {isInTrial && (
              <Text style={styles.trialText}>
                Dùng thử: còn {trialRemaining} ngày
              </Text>
            )}
          </View>
          <TouchableOpacity 
            style={styles.upgradeButton}
            onPress={() => router.push('/pricing')}
          >
            <Text style={styles.upgradeText}>Nâng cấp gói →</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Usage Stats */}
      <View style={styles.statsCard}>
        <View style={styles.statsHeader}>
          <Ionicons name="bar-chart-outline" size={20} color={Colors.slate[600]} />
          <Text style={styles.statsTitle}>Sử dụng hôm nay</Text>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '30%' }]} />
          </View>
          <Text style={styles.progressText}>3/10</Text>
        </View>
        <Text style={styles.statsSubtext}>Đã mở khóa 3 RFQ</Text>
      </View>

      {/* Access Level */}
      <View style={styles.accessCard}>
        <View style={styles.accessHeader}>
          <Ionicons name="key-outline" size={20} color={Colors.slate[600]} />
          <Text style={styles.accessTitle}>Quyền truy cập</Text>
        </View>
        <View style={styles.accessList}>
          <View style={styles.accessItem}>
            <Ionicons 
              name="checkmark-circle" 
              size={20} 
              color={Colors.success[600]} 
            />
            <Text style={styles.accessText}>Xem email</Text>
          </View>
          <View style={styles.accessItem}>
            <Ionicons 
              name="close-circle" 
              size={20} 
              color={Colors.slate[300]} 
            />
            <Text style={[styles.accessText, styles.accessDisabled]}>
              Xem số điện thoại
            </Text>
          </View>
          <View style={styles.accessItem}>
            <Ionicons 
              name="close-circle" 
              size={20} 
              color={Colors.slate[300]} 
            />
            <Text style={[styles.accessText, styles.accessDisabled]}>
              Xuất CSV
            </Text>
          </View>
        </View>
      </View>

      {/* Recent RFQs */}
      <View style={styles.recentCard}>
        <View style={styles.recentHeader}>
          <Ionicons name="time-outline" size={20} color={Colors.slate[600]} />
          <Text style={styles.recentTitle}>RFQ đã xem gần đây</Text>
        </View>
        <View style={styles.recentList}>
          <TouchableOpacity style={styles.recentItem}>
            <View style={styles.recentInfo}>
              <Text style={styles.recentName} numberOfLines={1}>
                Coffee Robusta Grade 1
              </Text>
              <Text style={styles.recentMeta}>Cà phê | 02/02/2026</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.slate[400]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.recentItem}>
            <View style={styles.recentInfo}>
              <Text style={styles.recentName} numberOfLines={1}>
                Black Pepper 500 ASTA
              </Text>
              <Text style={styles.recentMeta}>Tiêu | 01/02/2026</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.slate[400]} />
          </TouchableOpacity>
        </View>
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
  notLoggedIn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['2xl'],
    backgroundColor: Colors.slate[50],
  },
  notLoggedInTitle: {
    fontSize: FontSize.h2,
    fontWeight: FontWeight.bold,
    color: Colors.slate[800],
    marginTop: Spacing.lg,
  },
  notLoggedInText: {
    fontSize: FontSize.body,
    color: Colors.slate[500],
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  loginButton: {
    width: 200,
  },
  greeting: {
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  greetingText: {
    fontSize: FontSize.bodyLarge,
    color: Colors.slate[600],
  },
  userName: {
    fontWeight: FontWeight.semiBold,
    color: Colors.slate[900],
  },
  planCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.slate[200],
    ...Shadows.sm,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planInfo: {
    flex: 1,
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  planBadgeText: {
    fontSize: FontSize.bodyLarge,
    fontWeight: FontWeight.bold,
    color: Colors.slate[800],
  },
  trialText: {
    fontSize: FontSize.caption,
    color: Colors.success[600],
    marginTop: Spacing.xs,
  },
  upgradeButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  upgradeText: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
    color: Colors.primary[600],
  },
  statsCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.slate[200],
    ...Shadows.sm,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statsTitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semiBold,
    color: Colors.slate[700],
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.slate[100],
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary[600],
    borderRadius: BorderRadius.full,
  },
  progressText: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semiBold,
    color: Colors.slate[700],
  },
  statsSubtext: {
    fontSize: FontSize.caption,
    color: Colors.slate[500],
    marginTop: Spacing.sm,
  },
  accessCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.slate[200],
    ...Shadows.sm,
  },
  accessHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  accessTitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semiBold,
    color: Colors.slate[700],
  },
  accessList: {
    gap: Spacing.sm,
  },
  accessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  accessText: {
    fontSize: FontSize.body,
    color: Colors.slate[700],
  },
  accessDisabled: {
    color: Colors.slate[400],
  },
  recentCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.slate[200],
    ...Shadows.sm,
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  recentTitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semiBold,
    color: Colors.slate[700],
  },
  recentList: {
    gap: Spacing.sm,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate[100],
  },
  recentInfo: {
    flex: 1,
  },
  recentName: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
    color: Colors.slate[800],
  },
  recentMeta: {
    fontSize: FontSize.caption,
    color: Colors.slate[500],
    marginTop: 2,
  },
  bottomPadding: {
    height: Spacing['2xl'],
  },
});
