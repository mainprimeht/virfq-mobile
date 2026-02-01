import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, TextInput } from '../../components';
import { api } from '../../services/api';
import { Colors, Spacing, FontSize, FontWeight } from '../../constants';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    if (!email.trim()) {
      setError('Vui lòng nhập email');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email không hợp lệ');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    try {
      setIsLoading(true);
      await api.forgotPassword(email.trim());
      setSent(true);
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Không thể gửi email');
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.slate[700]} />
          </TouchableOpacity>

          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={80} color={Colors.success[600]} />
            </View>
            <Text style={styles.successTitle}>Email đã được gửi!</Text>
            <Text style={styles.successText}>
              Kiểm tra hộp thư của bạn và làm theo hướng dẫn để đặt lại mật khẩu.
            </Text>
            <Button
              title="Quay lại đăng nhập"
              onPress={() => router.replace('/(auth)/login')}
              style={styles.backToLoginButton}
            />
          </View>
        </View>
      </View>
    );
  }

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

        {/* Title */}
        <Text style={styles.title}>Đặt lại mật khẩu</Text>
        <Text style={styles.subtitle}>
          Nhập email của bạn để nhận link đặt lại mật khẩu
        </Text>

        {/* Form */}
        <View style={styles.form}>
          <TextInput
            label="Email"
            placeholder="Nhập email của bạn"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={error}
            leftIcon={<Ionicons name="mail-outline" size={20} color={Colors.slate[400]} />}
          />

          <Button
            title="Gửi link"
            onPress={handleSubmit}
            loading={isLoading}
            style={styles.submitButton}
          />
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
  title: {
    fontSize: FontSize.h1,
    fontWeight: FontWeight.bold,
    color: Colors.slate[900],
    marginTop: Spacing['2xl'],
  },
  subtitle: {
    fontSize: FontSize.body,
    color: Colors.slate[500],
    marginTop: Spacing.sm,
    marginBottom: Spacing['2xl'],
  },
  form: {
    width: '100%',
  },
  submitButton: {
    marginTop: Spacing.lg,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  successIcon: {
    marginBottom: Spacing.xl,
  },
  successTitle: {
    fontSize: FontSize.h1,
    fontWeight: FontWeight.bold,
    color: Colors.slate[900],
    textAlign: 'center',
  },
  successText: {
    fontSize: FontSize.body,
    color: Colors.slate[500],
    textAlign: 'center',
    marginTop: Spacing.md,
    lineHeight: 22,
  },
  backToLoginButton: {
    marginTop: Spacing['2xl'],
    width: '100%',
  },
});
