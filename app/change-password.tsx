import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, TextInput } from '../components';
import { api } from '../services/api';
import { Colors, Spacing, FontSize, FontWeight } from '../constants';

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!currentPassword) {
      newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    }
    
    if (!newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    try {
      setIsLoading(true);
      await api.changePassword(currentPassword, newPassword);
      Alert.alert(
        'Thành công',
        'Mật khẩu đã được thay đổi',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Không thể thay đổi mật khẩu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Đổi mật khẩu',
        }}
      />
      
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <View style={styles.form}>
            <TextInput
              label="Mật khẩu hiện tại"
              placeholder="Nhập mật khẩu hiện tại"
              value={currentPassword}
              onChangeText={(text) => {
                setCurrentPassword(text);
                if (errors.currentPassword) setErrors({ ...errors, currentPassword: '' });
              }}
              secureTextEntry={!showPasswords}
              error={errors.currentPassword}
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color={Colors.slate[400]} />}
            />

            <TextInput
              label="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChangeText={(text) => {
                setNewPassword(text);
                if (errors.newPassword) setErrors({ ...errors, newPassword: '' });
              }}
              secureTextEntry={!showPasswords}
              error={errors.newPassword}
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color={Colors.slate[400]} />}
            />

            <TextInput
              label="Xác nhận mật khẩu mới"
              placeholder="Nhập lại mật khẩu mới"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
              }}
              secureTextEntry={!showPasswords}
              error={errors.confirmPassword}
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color={Colors.slate[400]} />}
            />

            {/* Show/Hide Password */}
            <TouchableOpacity
              style={styles.showPasswordRow}
              onPress={() => setShowPasswords(!showPasswords)}
            >
              <Ionicons
                name={showPasswords ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={Colors.slate[500]}
              />
              <Text style={styles.showPasswordText}>
                {showPasswords ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Đổi mật khẩu"
              onPress={handleSubmit}
              loading={isLoading}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.slate[50],
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  form: {
    flex: 1,
  },
  showPasswordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  showPasswordText: {
    fontSize: FontSize.body,
    color: Colors.slate[500],
  },
  buttonContainer: {
    paddingBottom: Spacing.xl,
  },
});
