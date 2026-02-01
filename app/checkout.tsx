import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Button, TextInput } from '../components';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadows } from '../constants';

export default function CheckoutScreen() {
  const { planId, planName, period, price } = useLocalSearchParams<{
    planId: string;
    planName: string;
    period: string;
    price: string;
  }>();

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [countdown, setCountdown] = useState(30 * 60); // 30 minutes

  const totalPrice = parseFloat(price || '0');
  const finalPrice = totalPrice * (1 - discount);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value) + 'đ';
  };

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'WELCOME20') {
      setDiscount(0.2);
      setCouponApplied(true);
      Alert.alert('Thành công', 'Mã giảm giá đã được áp dụng!');
    } else {
      Alert.alert('Lỗi', 'Mã giảm giá không hợp lệ');
    }
  };

  const handleCopyContent = async () => {
    const content = `${planName}${period}M-${Date.now().toString(36).toUpperCase()}`;
    await Clipboard.setStringAsync(content);
    Alert.alert('Đã sao chép', 'Nội dung chuyển khoản đã được sao chép');
  };

  const handleCopyAccount = async () => {
    await Clipboard.setStringAsync('1234567890');
    Alert.alert('Đã sao chép', 'Số tài khoản đã được sao chép');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Order Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Đơn hàng</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Gói {planName}</Text>
          <Text style={styles.summaryValue}>{period} tháng</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Giá gốc</Text>
          <Text style={styles.summaryValue}>{formatPrice(totalPrice)}</Text>
        </View>
        {couponApplied && (
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, styles.discountLabel]}>
              Giảm giá ({discount * 100}%)
            </Text>
            <Text style={[styles.summaryValue, styles.discountValue]}>
              -{formatPrice(totalPrice * discount)}
            </Text>
          </View>
        )}
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Tổng thanh toán</Text>
          <Text style={styles.totalValue}>{formatPrice(finalPrice)}</Text>
        </View>
      </View>

      {/* Coupon */}
      <View style={styles.couponCard}>
        <Text style={styles.couponTitle}>Mã giảm giá</Text>
        <View style={styles.couponRow}>
          <TextInput
            placeholder="Nhập mã giảm giá"
            value={couponCode}
            onChangeText={setCouponCode}
            containerStyle={styles.couponInput}
            editable={!couponApplied}
          />
          <Button
            title="Áp dụng"
            onPress={handleApplyCoupon}
            variant="secondary"
            size="sm"
            disabled={couponApplied || !couponCode}
            style={styles.couponButton}
          />
        </View>
        {couponApplied && (
          <View style={styles.couponApplied}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.success[600]} />
            <Text style={styles.couponAppliedText}>
              Mã WELCOME20 đã được áp dụng
            </Text>
          </View>
        )}
      </View>

      {/* Payment Info */}
      <View style={styles.paymentCard}>
        {/* QR Code Placeholder */}
        <View style={styles.qrContainer}>
          <View style={styles.qrPlaceholder}>
            <Ionicons name="qr-code-outline" size={120} color={Colors.slate[400]} />
            <Text style={styles.qrText}>VietQR</Text>
          </View>
        </View>

        {/* Bank Info */}
        <View style={styles.bankInfo}>
          <View style={styles.bankRow}>
            <Text style={styles.bankLabel}>Ngân hàng</Text>
            <Text style={styles.bankValue}>Techcombank</Text>
          </View>
          <View style={styles.bankRow}>
            <Text style={styles.bankLabel}>Số tài khoản</Text>
            <View style={styles.bankValueRow}>
              <Text style={styles.bankValue}>1234567890</Text>
              <TouchableOpacity onPress={handleCopyAccount}>
                <Text style={styles.copyLink}>Copy</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.bankRow}>
            <Text style={styles.bankLabel}>Chủ tài khoản</Text>
            <Text style={styles.bankValue}>NGUYEN VAN A</Text>
          </View>
          <View style={styles.bankRow}>
            <Text style={styles.bankLabel}>Nội dung CK</Text>
            <View style={styles.bankValueRow}>
              <Text style={styles.bankValueBold}>
                {planName}{period}M-{Date.now().toString(36).toUpperCase().slice(0, 6)}
              </Text>
              <TouchableOpacity onPress={handleCopyContent}>
                <Text style={styles.copyLink}>Copy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Countdown */}
        <View style={styles.countdownContainer}>
          <Ionicons name="time-outline" size={20} color={Colors.warning[500]} />
          <Text style={styles.countdownText}>
            Hết hạn sau: <Text style={styles.countdownTime}>{formatTime(countdown)}</Text>
          </Text>
        </View>

        {/* Copy Button */}
        <Button
          title="Copy nội dung chuyển khoản"
          onPress={handleCopyContent}
          variant="secondary"
          icon={<Ionicons name="copy-outline" size={20} color={Colors.slate[600]} />}
        />
      </View>

      {/* Note */}
      <View style={styles.noteCard}>
        <Ionicons name="information-circle-outline" size={20} color={Colors.primary[600]} />
        <Text style={styles.noteText}>
          Sau khi chuyển khoản, hệ thống sẽ tự động kích hoạt gói trong vài phút. 
          Nếu quá 30 phút chưa được kích hoạt, vui lòng liên hệ support@virfq.com
        </Text>
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
  summaryCard: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  summaryTitle: {
    fontSize: FontSize.h3,
    fontWeight: FontWeight.semiBold,
    color: Colors.slate[800],
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  summaryLabel: {
    fontSize: FontSize.body,
    color: Colors.slate[600],
  },
  summaryValue: {
    fontSize: FontSize.body,
    color: Colors.slate[800],
  },
  discountLabel: {
    color: Colors.success[600],
  },
  discountValue: {
    color: Colors.success[600],
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.slate[200],
    marginTop: Spacing.sm,
    paddingTop: Spacing.md,
  },
  totalLabel: {
    fontSize: FontSize.bodyLarge,
    fontWeight: FontWeight.semiBold,
    color: Colors.slate[800],
  },
  totalValue: {
    fontSize: FontSize.h2,
    fontWeight: FontWeight.bold,
    color: Colors.primary[600],
  },
  couponCard: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  couponTitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semiBold,
    color: Colors.slate[700],
    marginBottom: Spacing.md,
  },
  couponRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  couponInput: {
    flex: 1,
    marginBottom: 0,
  },
  couponButton: {
    alignSelf: 'flex-start',
  },
  couponApplied: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  couponAppliedText: {
    fontSize: FontSize.caption,
    color: Colors.success[600],
  },
  paymentCard: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  qrPlaceholder: {
    width: 180,
    height: 180,
    backgroundColor: Colors.slate[50],
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.slate[200],
  },
  qrText: {
    fontSize: FontSize.caption,
    color: Colors.slate[500],
    marginTop: Spacing.xs,
  },
  bankInfo: {
    backgroundColor: Colors.slate[50],
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  bankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate[100],
  },
  bankLabel: {
    fontSize: FontSize.body,
    color: Colors.slate[500],
  },
  bankValue: {
    fontSize: FontSize.body,
    color: Colors.slate[800],
  },
  bankValueBold: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semiBold,
    color: Colors.slate[900],
  },
  bankValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  copyLink: {
    fontSize: FontSize.caption,
    color: Colors.primary[600],
    fontWeight: FontWeight.medium,
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.warning[50],
    borderRadius: BorderRadius.md,
  },
  countdownText: {
    fontSize: FontSize.body,
    color: Colors.slate[700],
  },
  countdownTime: {
    fontWeight: FontWeight.bold,
    color: Colors.warning[600],
  },
  noteCard: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    backgroundColor: Colors.primary[50],
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  noteText: {
    flex: 1,
    fontSize: FontSize.caption,
    color: Colors.primary[700],
    lineHeight: 18,
  },
  bottomPadding: {
    height: Spacing['3xl'],
  },
});
