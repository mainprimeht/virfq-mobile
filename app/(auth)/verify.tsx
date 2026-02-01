import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, TextInput } from '../../components';
import { useI18n } from '../../i18n';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants';
import * as api from '../../services/api';

export default function VerifyScreen() {
  const { t } = useI18n();
  const params = useLocalSearchParams<{ email: string }>();
  const email = params.email || '';

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Alert.alert('Lỗi', 'Mã xác thực phải có 6 chữ số');
      return;
    }

    setIsLoading(true);
    try {
      await api.verifyOTP(email, otp);
      Alert.alert('Thành công', 'Email đã được xác thực!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') },
      ]);
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Mã xác thực không đúng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await api.resendVerification(email);
      Alert.alert('Đã gửi', 'Mã xác thực mới đã được gửi đến email của bạn');
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể gửi lại mã');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📧</Text>
        </View>
        <Text style={styles.title}>{t.auth.verifyEmail}</Text>
        <Text style={styles.subtitle}>{t.auth.otpSent}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          label={t.auth.enterOTP}
          placeholder="000000"
          value={otp}
          onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, '').slice(0, 6))}
          keyboardType="number-pad"
          maxLength={6}
          style={styles.otpInput}
        />

        <Button
          title="Xác thực"
          onPress={handleVerify}
          loading={isLoading}
          disabled={otp.length !== 6}
          style={styles.verifyButton}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Không nhận được mã?</Text>
        <TouchableOpacity onPress={handleResend} disabled={isResending}>
          <Text style={[styles.resendLink, isResending && styles.resendDisabled]}>
            {isResending ? 'Đang gửi...' : t.auth.resendOTP}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flexGrow: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing.md,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  email: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.light.primary,
    marginTop: Spacing.xs,
  },
  form: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  otpInput: {
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 8,
    fontWeight: '600',
  },
  verifyButton: {
    marginTop: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  footerText: {
    fontSize: FontSize.md,
    color: Colors.light.textSecondary,
  },
  resendLink: {
    fontSize: FontSize.md,
    color: Colors.light.primary,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  resendDisabled: {
    opacity: 0.5,
  },
});
