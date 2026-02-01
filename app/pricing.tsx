import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadows } from '../constants';

interface Plan {
  id: string;
  name: string;
  icon: string;
  price: number;
  priceMonthly: number;
  features: string[];
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'FREE',
    icon: '🆓',
    price: 0,
    priceMonthly: 0,
    features: [
      '5 RFQ/ngày',
      'Xem thông tin cơ bản',
      'Tìm kiếm & lọc RFQ',
    ],
  },
  {
    id: 'starter',
    name: 'STARTER',
    icon: '⭐️',
    price: 299000,
    priceMonthly: 299000,
    features: [
      '10 RFQ/ngày',
      'Xem email buyer',
      'Tìm kiếm & lọc RFQ',
      'Hỗ trợ email',
    ],
  },
  {
    id: 'silver',
    name: 'SILVER',
    icon: '🥈',
    price: 599000,
    priceMonthly: 599000,
    features: [
      '30 RFQ/ngày',
      'Email + Số điện thoại',
      'Tìm kiếm & lọc RFQ',
      'Hỗ trợ ưu tiên',
    ],
  },
  {
    id: 'gold',
    name: 'GOLD',
    icon: '🥇',
    price: 999000,
    priceMonthly: 999000,
    features: [
      'Không giới hạn RFQ',
      'Full contact + WhatsApp',
      'Early Access 🔥',
      'Xuất CSV',
      'Hỗ trợ 24/7',
    ],
    popular: true,
  },
];

type Period = '1' | '6' | '12';

export default function PricingScreen() {
  const [period, setPeriod] = useState<Period>('1');

  const getDiscount = (p: Period) => {
    switch (p) {
      case '6': return 0.1; // 10% off
      case '12': return 0.2; // 20% off
      default: return 0;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const handleSelectPlan = (plan: Plan) => {
    if (plan.id === 'free') {
      router.back();
      return;
    }
    
    const discount = getDiscount(period);
    const months = parseInt(period);
    const totalPrice = plan.price * months * (1 - discount);
    
    router.push({
      pathname: '/checkout',
      params: {
        planId: plan.id,
        planName: plan.name,
        period,
        price: totalPrice.toString(),
      },
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {(['1', '6', '12'] as Period[]).map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.periodButton, period === p && styles.periodButtonActive]}
            onPress={() => setPeriod(p)}
          >
            <Text style={[styles.periodText, period === p && styles.periodTextActive]}>
              {p === '1' ? '1 tháng' : p === '6' ? '6 tháng' : '12 tháng'}
            </Text>
            {p !== '1' && (
              <Text style={[styles.periodDiscount, period === p && styles.periodDiscountActive]}>
                -{getDiscount(p) * 100}%
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Plans */}
      <View style={styles.plansContainer}>
        {PLANS.map((plan) => {
          const discount = getDiscount(period);
          const discountedPrice = plan.price * (1 - discount);
          
          return (
            <View 
              key={plan.id} 
              style={[styles.planCard, plan.popular && styles.planCardPopular]}
            >
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>PHỔ BIẾN</Text>
                </View>
              )}
              
              <View style={styles.planHeader}>
                <Text style={styles.planIcon}>{plan.icon}</Text>
                <Text style={styles.planName}>{plan.name}</Text>
              </View>
              
              <View style={styles.priceContainer}>
                {discount > 0 && plan.price > 0 && (
                  <Text style={styles.originalPrice}>{formatPrice(plan.price)}</Text>
                )}
                <Text style={styles.price}>
                  {plan.price === 0 ? 'Miễn phí' : formatPrice(discountedPrice)}
                </Text>
                {plan.price > 0 && <Text style={styles.priceUnit}>/tháng</Text>}
              </View>
              
              <View style={styles.featuresContainer}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" size={18} color={Colors.success[600]} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
              
              <Button
                title={plan.id === 'free' ? 'Gói hiện tại' : 'Chọn gói này'}
                onPress={() => handleSelectPlan(plan)}
                variant={plan.popular ? 'cta' : plan.id === 'free' ? 'secondary' : 'primary'}
                disabled={plan.id === 'free'}
              />
            </View>
          );
        })}
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
  periodSelector: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xs,
    ...Shadows.sm,
  },
  periodButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  periodButtonActive: {
    backgroundColor: Colors.primary[600],
  },
  periodText: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
    color: Colors.slate[600],
  },
  periodTextActive: {
    color: Colors.white,
  },
  periodDiscount: {
    fontSize: FontSize.tiny,
    color: Colors.success[600],
    fontWeight: FontWeight.bold,
    marginTop: 2,
  },
  periodDiscountActive: {
    color: Colors.warning[100],
  },
  plansContainer: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  planCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.slate[200],
    ...Shadows.sm,
  },
  planCardPopular: {
    borderColor: Colors.cta.DEFAULT,
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: '50%',
    transform: [{ translateX: -40 }],
    backgroundColor: Colors.cta.DEFAULT,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  popularText: {
    fontSize: FontSize.tiny,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  planIcon: {
    fontSize: 24,
  },
  planName: {
    fontSize: FontSize.h2,
    fontWeight: FontWeight.bold,
    color: Colors.slate[900],
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.lg,
  },
  originalPrice: {
    fontSize: FontSize.body,
    color: Colors.slate[400],
    textDecorationLine: 'line-through',
    marginRight: Spacing.sm,
  },
  price: {
    fontSize: FontSize.h1,
    fontWeight: FontWeight.bold,
    color: Colors.slate[900],
  },
  priceUnit: {
    fontSize: FontSize.body,
    color: Colors.slate[500],
    marginLeft: Spacing.xs,
  },
  featuresContainer: {
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  featureText: {
    fontSize: FontSize.body,
    color: Colors.slate[700],
  },
  bottomPadding: {
    height: Spacing['3xl'],
  },
});
