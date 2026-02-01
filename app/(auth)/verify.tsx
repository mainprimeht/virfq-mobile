import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, OTPInput } from '../../components';
import { useAuthStore } from '../../store';
import { Colors, Spacing, FontSize, FontWeight } from '../../constants';

export default function VerifyScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const { verifyOTP, resendOTP, isLoading } = useAuthStore();
  
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Vui lòng nhập đủ 6 số');
      return;
    }
    
    try {
      await verifyOTP(email, otp);
      Alert.alert(
        'Xác thực thành công',
        'Tài khoản của bạn đã được kích hoạt',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
      );
    } catch (err: any) {
      setError(err.message || 'Mã OTP không chính xác');
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    try {
      await resendOTP(email);
      setCountdown(60);
      setCanResend(false);
      setError('');
      Alert.alert('Đã gửi', 'Mã OTP mới đã được gửi đến email của bạn');
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Không thể gửi lại mã OTP');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.slate[700]} />
        </TouchableOpacity>

        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="mail-open-outline" size={64} color={Colors.primary[600]} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Xác thực email</Text>
        <Text style={styles.subtitle}>
          Nhập mã 6 số đã được gửi đến{'\n'}
          <Text style={styles.emailText}>{email}</Text>
        </Text>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          <OTPInput
            value={otp}
            onChange={(value) => {
              setOtp(value);
              if (error) setError('');
            }}
            error={!!error}
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        {/* Verify Button */}
        <Button
          title="Xác nhận"
          onPress={handleVerify}
          loading={isLoading}
          disabled={otp.length !== 6}
          style={styles.verifyButton}
        />

        {/* Resend */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Không nhận được mã?</Text>
          {canResend ? (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendLink}>Gửi lại</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.countdownText}>Gửi lại sau {countdown}s</Text>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: Spacing['2xl'],
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSize.h1,
    fontWeight: FontWeight.bold,
    color: Colors.slate[900],
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.body,
    color: Colors.slate[500],
    textAlign: 'center',
    marginTop: Spacing.md,
    lineHeight: 22,
  },
  emailText: {
    fontWeight: FontWeight.semiBold,
    color: Colors.slate[700],
  },
  otpContainer: {
    marginTop: Spacing['3xl'],
    alignItems: 'center',
  },
  errorText: {
    fontSize: FontSize.caption,
    color: Colors.error[600],
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  verifyButton: {
    marginTop: Spacing['2xl'],
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  resendText: {
    fontSize: FontSize.body,
    color: Colors.slate[500],
  },
  resendLink: {
    fontSize: FontSize.body,
    color: Colors.primary[600],
    fontWeight: FontWeight.semiBold,
    marginTop: Spacing.xs,
  },
  countdownText: {
    fontSize: FontSize.body,
    color: Colors.slate[400],
    marginTop: Spacing.xs,
  },
});
