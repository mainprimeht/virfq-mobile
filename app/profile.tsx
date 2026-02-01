import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, TextInput } from '../components';
import { useAuthStore } from '../store';
import { api } from '../services/api';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadows } from '../constants';

const COUNTRIES = [
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
];

export default function ProfileScreen() {
  const { user, updateProfile, isLoading } = useAuthStore();
  
  const [name, setName] = useState(user?.name || '');
  const [company, setCompany] = useState(user?.company || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp || '');
  const [country, setCountry] = useState(user?.country || 'VN');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedCountry = COUNTRIES.find(c => c.code === country) || COUNTRIES[0];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    
    try {
      await updateProfile({
        name: name.trim(),
        company: company.trim() || undefined,
        phone: phone.trim() || undefined,
        whatsapp: whatsapp.trim() || undefined,
        country,
      });
      Alert.alert('Thành công', 'Hồ sơ đã được cập nhật');
      router.back();
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Không thể cập nhật hồ sơ');
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Hồ sơ cá nhân',
          headerRight: () => (
            <TouchableOpacity onPress={handleSave} disabled={isLoading}>
              <Text style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}>
                Lưu
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <TextInput
            label="Họ và tên *"
            placeholder="Nhập họ tên của bạn"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) setErrors({ ...errors, name: '' });
            }}
            error={errors.name}
            leftIcon={<Ionicons name="person-outline" size={20} color={Colors.slate[400]} />}
          />

          <TextInput
            label="Email"
            value={user?.email || ''}
            editable={false}
            leftIcon={<Ionicons name="mail-outline" size={20} color={Colors.slate[400]} />}
            hint="Email không thể thay đổi"
          />

          <TextInput
            label="Tên công ty"
            placeholder="Nhập tên công ty"
            value={company}
            onChangeText={setCompany}
            leftIcon={<Ionicons name="business-outline" size={20} color={Colors.slate[400]} />}
          />

          <TextInput
            label="Số điện thoại"
            placeholder="+84 901 234 567"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            leftIcon={<Ionicons name="call-outline" size={20} color={Colors.slate[400]} />}
          />

          <TextInput
            label="WhatsApp"
            placeholder="+84 901 234 567"
            value={whatsapp}
            onChangeText={setWhatsapp}
            keyboardType="phone-pad"
            leftIcon={<Ionicons name="logo-whatsapp" size={20} color={Colors.slate[400]} />}
          />

          {/* Country Picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quốc gia</Text>
            <TouchableOpacity 
              style={styles.countrySelector}
              onPress={() => setShowCountryPicker(!showCountryPicker)}
            >
              <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
              <Text style={styles.countryName}>{selectedCountry.name}</Text>
              <Ionicons 
                name={showCountryPicker ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color={Colors.slate[400]} 
              />
            </TouchableOpacity>
            
            {showCountryPicker && (
              <View style={styles.countryList}>
                {COUNTRIES.map((c) => (
                  <TouchableOpacity
                    key={c.code}
                    style={[
                      styles.countryOption,
                      country === c.code && styles.countryOptionSelected,
                    ]}
                    onPress={() => {
                      setCountry(c.code);
                      setShowCountryPicker(false);
                    }}
                  >
                    <Text style={styles.countryFlag}>{c.flag}</Text>
                    <Text style={[
                      styles.countryOptionText,
                      country === c.code && styles.countryOptionTextSelected,
                    ]}>
                      {c.name}
                    </Text>
                    {country === c.code && (
                      <Ionicons name="checkmark" size={20} color={Colors.primary[600]} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Lưu thay đổi"
            onPress={handleSave}
            loading={isLoading}
          />
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.slate[50],
  },
  saveButton: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary[600],
    paddingHorizontal: Spacing.md,
  },
  saveButtonDisabled: {
    color: Colors.slate[400],
  },
  form: {
    padding: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
    color: Colors.slate[700],
    marginBottom: Spacing.sm,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.slate[200],
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  countryFlag: {
    fontSize: 24,
  },
  countryName: {
    flex: 1,
    fontSize: FontSize.body,
    color: Colors.slate[800],
  },
  countryList: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.slate[200],
    overflow: 'hidden',
    ...Shadows.md,
  },
  countryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate[100],
  },
  countryOptionSelected: {
    backgroundColor: Colors.primary[50],
  },
  countryOptionText: {
    flex: 1,
    fontSize: FontSize.body,
    color: Colors.slate[700],
  },
  countryOptionTextSelected: {
    color: Colors.primary[700],
    fontWeight: FontWeight.medium,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.lg,
  },
  bottomPadding: {
    height: Spacing['3xl'],
  },
});
