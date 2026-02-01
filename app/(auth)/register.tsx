import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Button, TextInput } from '../../components';
import { useAuthStore } from '../../store';
import { useI18n } from '../../i18n';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants';

export default function RegisterScreen() {
  const { t } = useI18n();
  const { register, isLoading } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      await register({ email, password, name, company });
      // Navigate to verify screen with email
      router.replace({
        pathname: '/(auth)/verify',
        params: { email },
      });
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Đăng ký thất bại');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Tạo tài khoản</Text>
          <Text style={styles.subtitle}>
            Đăng ký miễn phí để xem thông tin liên hệ người mua
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <TextInput
            label={t.auth.name}
            placeholder="Nguyễn Văn A"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            leftIcon="person-outline"
          />

          <TextInput
            label={t.auth.email + ' *'}
            placeholder="email@example.com"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            leftIcon="mail-outline"
          />

          <TextInput
            label={t.auth.password + ' *'}
            placeholder="Tối thiểu 8 ký tự"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secureTextEntry
            leftIcon="lock-closed-outline"
          />

          <TextInput
            label={t.auth.company}
            placeholder="Công ty TNHH ABC"
            value={company}
            onChangeText={setCompany}
            leftIcon="business-outline"
          />

          <Button
            title={t.auth.register}
            onPress={handleRegister}
            loading={isLoading}
            style={styles.registerButton}
          />
        </View>

        {/* Login Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t.auth.hasAccount}</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.loginLink}>{t.auth.loginNow}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.light.textSecondary,
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
  registerButton: {
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
  loginLink: {
    fontSize: FontSize.md,
    color: Colors.light.primary,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
});
