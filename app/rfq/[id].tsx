import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Loading } from '../../components';
import { useRFQStore, useAuthStore } from '../../store';
import { useI18n } from '../../i18n';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants';

export default function RFQDetailScreen() {
  const { t, locale } = useI18n();
  const params = useLocalSearchParams<{ id: string }>();
  const id = params.id || '';

  const { isAuthenticated } = useAuthStore();
  const {
    currentRFQ,
    currentAccess,
    isLoading,
    fetchRFQDetail,
    unlockRFQ,
  } = useRFQStore();

  const [isUnlocking, setIsUnlocking] = useState(false);

  useEffect(() => {
    if (id) {
      fetchRFQDetail(id);
    }
  }, [id]);

  const handleUnlock = async () => {
    if (!isAuthenticated) {
      router.push('/(auth)/login');
      return;
    }

    setIsUnlocking(true);
    try {
      await unlockRFQ(id);
      Alert.alert('Thành công', 'Đã mở khóa thông tin liên hệ');
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể mở khóa');
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleContact = (type: 'email' | 'phone' | 'whatsapp', value: string) => {
    switch (type) {
      case 'email':
        Linking.openURL(`mailto:${value}`);
        break;
      case 'phone':
        Linking.openURL(`tel:${value}`);
        break;
      case 'whatsapp':
        Linking.openURL(`https://wa.me/${value.replace(/[^0-9]/g, '')}`);
        break;
    }
  };

  if (isLoading || !currentRFQ) {
    return <Loading fullScreen text={t.common.loading} />;
  }

  const rfq = currentRFQ;
  const access = currentAccess;
  const isUnlocked = access?.contactLevel !== 'none';

  const title = locale === 'vi' && rfq.translationVi?.titleVi
    ? rfq.translationVi.titleVi
    : rfq.titleEn;

  const description = locale === 'vi' && rfq.translationVi?.descriptionVi
    ? rfq.translationVi.descriptionVi
    : rfq.descriptionEn;

  const category = locale === 'vi'
    ? rfq.productCategory?.nameVi
    : rfq.productCategory?.nameEn;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        {category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        )}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{formatDate(rfq.createdAt)}</Text>
      </View>

      {/* Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin yêu cầu</Text>
        
        <View style={styles.detailCard}>
          <DetailRow
            icon="cube-outline"
            label={t.rfq.quantity}
            value={`${rfq.quantity} ${rfq.quantityUnit}`}
          />
          <DetailRow
            icon="location-outline"
            label={t.rfq.buyerCountry}
            value={rfq.buyerCountry}
          />
          <DetailRow
            icon="boat-outline"
            label={t.rfq.incoterms}
            value={rfq.incoterms}
          />
          {rfq.targetPrice && (
            <DetailRow
              icon="pricetag-outline"
              label={t.rfq.targetPrice}
              value={`$${rfq.targetPrice}/MT`}
            />
          )}
          {rfq.shippingPort && (
            <DetailRow
              icon="navigate-outline"
              label={t.rfq.shippingPort}
              value={rfq.shippingPort}
            />
          )}
        </View>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mô tả chi tiết</Text>
        <View style={styles.descriptionCard}>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>

      {/* Contact Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.rfq.contact}</Text>
        
        {isUnlocked ? (
          <View style={styles.contactCard}>
            {rfq.buyerEmail && (
              <TouchableOpacity
                style={styles.contactRow}
                onPress={() => handleContact('email', rfq.buyerEmail!)}
              >
                <Ionicons name="mail" size={24} color={Colors.light.primary} />
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>{t.rfq.buyerEmail}</Text>
                  <Text style={styles.contactValue}>{rfq.buyerEmail}</Text>
                </View>
                <Ionicons name="open-outline" size={20} color={Colors.light.textMuted} />
              </TouchableOpacity>
            )}

            {rfq.buyerPhone && access?.contactLevel !== 'email_only' && (
              <TouchableOpacity
                style={styles.contactRow}
                onPress={() => handleContact('phone', rfq.buyerPhone!)}
              >
                <Ionicons name="call" size={24} color={Colors.light.secondary} />
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>{t.rfq.buyerPhone}</Text>
                  <Text style={styles.contactValue}>{rfq.buyerPhone}</Text>
                </View>
                <Ionicons name="open-outline" size={20} color={Colors.light.textMuted} />
              </TouchableOpacity>
            )}

            {rfq.buyerWhatsapp && access?.contactLevel === 'full' && (
              <TouchableOpacity
                style={styles.contactRow}
                onPress={() => handleContact('whatsapp', rfq.buyerWhatsapp!)}
              >
                <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>{t.rfq.buyerWhatsapp}</Text>
                  <Text style={styles.contactValue}>{rfq.buyerWhatsapp}</Text>
                </View>
                <Ionicons name="open-outline" size={20} color={Colors.light.textMuted} />
              </TouchableOpacity>
            )}

            {rfq.buyerCompany && (
              <View style={styles.contactRow}>
                <Ionicons name="business" size={24} color={Colors.light.textSecondary} />
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>{t.rfq.buyerCompany}</Text>
                  <Text style={styles.contactValue}>{rfq.buyerCompany}</Text>
                </View>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.lockedCard}>
            <Ionicons name="lock-closed" size={48} color={Colors.light.textMuted} />
            <Text style={styles.lockedText}>
              Mở khóa để xem thông tin liên hệ người mua
            </Text>
            <Button
              title={t.rfq.unlock}
              onPress={handleUnlock}
              loading={isUnlocking}
              style={styles.unlockButton}
            />
            {access?.quotaInfo && (
              <Text style={styles.quotaText}>
                Còn {access.quotaInfo.remaining} lượt mở khóa
              </Text>
            )}
          </View>
        )}
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={20} color={Colors.light.textSecondary} />
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  headerCard: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.light.primary + '15',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  categoryText: {
    fontSize: FontSize.sm,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.light.text,
    lineHeight: 28,
  },
  date: {
    fontSize: FontSize.sm,
    color: Colors.light.textMuted,
    marginTop: Spacing.sm,
  },
  section: {
    padding: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  detailCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  detailLabel: {
    flex: 1,
    marginLeft: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.light.textSecondary,
  },
  detailValue: {
    fontSize: FontSize.md,
    fontWeight: '500',
    color: Colors.light.text,
  },
  descriptionCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  description: {
    fontSize: FontSize.md,
    color: Colors.light.text,
    lineHeight: 24,
  },
  contactCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  contactInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  contactLabel: {
    fontSize: FontSize.xs,
    color: Colors.light.textSecondary,
  },
  contactValue: {
    fontSize: FontSize.md,
    fontWeight: '500',
    color: Colors.light.text,
    marginTop: 2,
  },
  lockedCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  lockedText: {
    fontSize: FontSize.md,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  unlockButton: {
    width: '100%',
  },
  quotaText: {
    fontSize: FontSize.sm,
    color: Colors.light.textMuted,
    marginTop: Spacing.md,
  },
  bottomPadding: {
    height: Spacing.xxl,
  },
});
