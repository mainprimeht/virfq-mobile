import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Share,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Button, Loading, QualityScoreBadge, StatusBadge, CategoryBadge } from '../../components';
import { useRFQStore, useAuthStore } from '../../store';
import { api } from '../../services/api';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadows } from '../../constants';
import type { RFQ, UnlockedContact } from '../../types';

export default function RFQDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isAuthenticated } = useAuthStore();
  const { currentRFQ, fetchRFQDetail, isLoading } = useRFQStore();
  
  const [unlockedContact, setUnlockedContact] = useState<UnlockedContact | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (id) {
      fetchRFQDetail(id);
    }
  }, [id]);

  const handleUnlock = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Đăng nhập',
        'Bạn cần đăng nhập để mở khóa thông tin liên hệ',
        [
          { text: 'Hủy', style: 'cancel' },
          { text: 'Đăng nhập', onPress: () => router.push('/(auth)/login') },
        ]
      );
      return;
    }

    try {
      setIsUnlocking(true);
      const response = await api.unlockRFQ(id!);
      if (response.data) {
        setUnlockedContact(response.data);
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể mở khóa RFQ');
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleCopy = async (text: string, label: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Đã sao chép', `${label} đã được sao chép`);
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    Linking.openURL(`whatsapp://send?phone=${cleanPhone}`);
  };

  const handleShare = async () => {
    if (!currentRFQ) return;
    try {
      await Share.share({
        title: currentRFQ.titleEn,
        message: `${currentRFQ.titleEn}\n\nXem chi tiết tại ViRFQ: https://virfq.com/rfq/${currentRFQ.id}`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // TODO: Implement save to favorites API
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading || !currentRFQ) {
    return <Loading />;
  }

  const rfq = currentRFQ;
  const isNew = new Date().getTime() - new Date(rfq.createdAt).getTime() < 24 * 60 * 60 * 1000;
  const isHot = rfq.qualityScore && rfq.qualityScore >= 80;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
          <Ionicons 
            name={isSaved ? 'star' : 'star-outline'} 
            size={24} 
            color={isSaved ? Colors.warning[500] : Colors.slate[600]} 
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color={Colors.slate[600]} />
        </TouchableOpacity>
      </View>

      {/* Badges */}
      <View style={styles.badgesRow}>
        {rfq.productCategory && (
          <CategoryBadge name={rfq.productCategory.nameVi || rfq.productCategory.nameEn} />
        )}
        {isHot && <StatusBadge type="hot" />}
        {isNew && !isHot && <StatusBadge type="new" />}
        {rfq.isFeatured && <StatusBadge type="verified" />}
      </View>

      {/* Title */}
      <Text style={styles.title}>{rfq.titleEn}</Text>
      {rfq.translationVi?.titleVi && (
        <Text style={styles.titleVi}>{rfq.translationVi.titleVi}</Text>
      )}

      {/* Quality Score Card */}
      {rfq.qualityScore && (
        <View style={styles.qualityCard}>
          <View style={styles.qualityHeader}>
            <Ionicons name="trophy" size={20} color={Colors.warning[500]} />
            <Text style={styles.qualityTitle}>Quality Score</Text>
          </View>
          <View style={styles.qualityScoreRow}>
            <Text style={styles.qualityScoreNumber}>{rfq.qualityScore}</Text>
            <Text style={styles.qualityScoreMax}>/100</Text>
          </View>
          <View style={styles.qualityBar}>
            <View 
              style={[
                styles.qualityBarFill, 
                { width: `${rfq.qualityScore}%` }
              ]} 
            />
          </View>
        </View>
      )}

      {/* Details Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="list-outline" size={20} color={Colors.slate[600]} />
          <Text style={styles.sectionTitle}>Thông tin yêu cầu</Text>
        </View>
        <View style={styles.detailsList}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Số lượng</Text>
            <Text style={styles.detailValue}>{rfq.quantity} {rfq.quantityUnit}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Quốc gia</Text>
            <Text style={styles.detailValue}>{rfq.buyerCountry}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Điều kiện giao hàng</Text>
            <Text style={styles.detailValue}>{rfq.incoterms}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Đăng lúc</Text>
            <Text style={styles.detailValue}>{formatDate(rfq.createdAt)}</Text>
          </View>
        </View>
      </View>

      {/* Description Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="document-text-outline" size={20} color={Colors.slate[600]} />
          <Text style={styles.sectionTitle}>Mô tả chi tiết</Text>
        </View>
        <Text style={styles.description}>{rfq.descriptionEn}</Text>
      </View>

      {/* Vietnamese Translation */}
      {rfq.translationVi?.descriptionVi && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.flagEmoji}>🇻🇳</Text>
            <Text style={styles.sectionTitle}>Tóm tắt tiếng Việt</Text>
          </View>
          <Text style={styles.description}>{rfq.translationVi.descriptionVi}</Text>
        </View>
      )}

      {/* Contact Section */}
      <View style={styles.contactSection}>
        {unlockedContact ? (
          // Unlocked State
          <View style={styles.contactUnlocked}>
            <View style={styles.contactHeader}>
              <Ionicons name="checkmark-circle" size={24} color={Colors.success[600]} />
              <Text style={styles.contactTitle}>Thông tin liên hệ</Text>
            </View>

            {unlockedContact.name && (
              <View style={styles.contactRow}>
                <Ionicons name="person" size={18} color={Colors.slate[500]} />
                <Text style={styles.contactValue}>{unlockedContact.name}</Text>
              </View>
            )}

            {unlockedContact.company && (
              <View style={styles.contactRow}>
                <Ionicons name="business" size={18} color={Colors.slate[500]} />
                <Text style={styles.contactValue}>{unlockedContact.company}</Text>
              </View>
            )}

            {unlockedContact.email && (
              <View style={styles.contactActionRow}>
                <View style={styles.contactRow}>
                  <Ionicons name="mail" size={18} color={Colors.slate[500]} />
                  <Text style={styles.contactValue}>{unlockedContact.email}</Text>
                </View>
                <View style={styles.contactActions}>
                  <TouchableOpacity 
                    style={styles.actionChip}
                    onPress={() => handleCopy(unlockedContact.email!, 'Email')}
                  >
                    <Text style={styles.actionChipText}>Copy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionChip}
                    onPress={() => handleEmail(unlockedContact.email!)}
                  >
                    <Text style={styles.actionChipText}>Gửi email</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {unlockedContact.phone && (
              <View style={styles.contactActionRow}>
                <View style={styles.contactRow}>
                  <Ionicons name="call" size={18} color={Colors.slate[500]} />
                  <Text style={styles.contactValue}>{unlockedContact.phone}</Text>
                </View>
                <View style={styles.contactActions}>
                  <TouchableOpacity 
                    style={styles.actionChip}
                    onPress={() => handleCopy(unlockedContact.phone!, 'Số điện thoại')}
                  >
                    <Text style={styles.actionChipText}>Copy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionChip}
                    onPress={() => handleCall(unlockedContact.phone!)}
                  >
                    <Text style={styles.actionChipText}>Gọi</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {unlockedContact.whatsapp && (
              <View style={styles.whatsappButton}>
                <Button
                  title="Nhắn tin WhatsApp"
                  onPress={() => handleWhatsApp(unlockedContact.whatsapp!)}
                  variant="secondary"
                  icon={<Ionicons name="logo-whatsapp" size={20} color={Colors.success[600]} />}
                />
              </View>
            )}
          </View>
        ) : (
          // Locked State
          <View style={styles.contactLocked}>
            <Ionicons name="lock-closed" size={32} color={Colors.slate[400]} />
            <Text style={styles.contactLockedTitle}>Thông tin liên hệ</Text>
            <Text style={styles.contactLockedText}>
              Mở khóa để xem chi tiết buyer:
            </Text>
            <View style={styles.contactLockedList}>
              <Text style={styles.contactLockedItem}>• Email</Text>
              <Text style={styles.contactLockedItem}>• Số điện thoại</Text>
              <Text style={styles.contactLockedItem}>• WhatsApp</Text>
            </View>
            <Button
              title="🔓 Mở khóa (3/5)"
              onPress={handleUnlock}
              variant="cta"
              loading={isUnlocking}
              style={styles.unlockButton}
            />
            <Text style={styles.remainingText}>Còn 2 lượt mở khóa hôm nay</Text>
          </View>
        )}
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.slate[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  title: {
    fontSize: FontSize.h2,
    fontWeight: FontWeight.bold,
    color: Colors.slate[900],
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    lineHeight: 28,
  },
  titleVi: {
    fontSize: FontSize.body,
    color: Colors.slate[500],
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
  qualityCard: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    padding: Spacing.lg,
    backgroundColor: Colors.warning[50],
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.warning[100],
  },
  qualityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  qualityTitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semiBold,
    color: Colors.slate[700],
  },
  qualityScoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: Spacing.sm,
  },
  qualityScoreNumber: {
    fontSize: 36,
    fontWeight: FontWeight.bold,
    color: Colors.slate[900],
  },
  qualityScoreMax: {
    fontSize: FontSize.bodyLarge,
    color: Colors.slate[500],
    marginLeft: Spacing.xs,
  },
  qualityBar: {
    height: 8,
    backgroundColor: Colors.slate[200],
    borderRadius: BorderRadius.full,
    marginTop: Spacing.md,
    overflow: 'hidden',
  },
  qualityBarFill: {
    height: '100%',
    backgroundColor: Colors.success[600],
    borderRadius: BorderRadius.full,
  },
  section: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.bodyLarge,
    fontWeight: FontWeight.semiBold,
    color: Colors.slate[800],
  },
  flagEmoji: {
    fontSize: 20,
  },
  detailsList: {
    backgroundColor: Colors.slate[50],
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate[100],
  },
  detailLabel: {
    fontSize: FontSize.body,
    color: Colors.slate[500],
  },
  detailValue: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
    color: Colors.slate[800],
  },
  description: {
    fontSize: FontSize.body,
    color: Colors.slate[700],
    lineHeight: 22,
  },
  contactSection: {
    marginTop: Spacing.xl,
    marginHorizontal: Spacing.lg,
  },
  contactLocked: {
    backgroundColor: Colors.slate[50],
    borderRadius: BorderRadius.xl,
    padding: Spacing['2xl'],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.slate[200],
  },
  contactLockedTitle: {
    fontSize: FontSize.h3,
    fontWeight: FontWeight.semiBold,
    color: Colors.slate[800],
    marginTop: Spacing.md,
  },
  contactLockedText: {
    fontSize: FontSize.body,
    color: Colors.slate[500],
    marginTop: Spacing.sm,
  },
  contactLockedList: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  contactLockedItem: {
    fontSize: FontSize.body,
    color: Colors.slate[600],
    marginVertical: 2,
  },
  unlockButton: {
    width: '100%',
  },
  remainingText: {
    fontSize: FontSize.caption,
    color: Colors.slate[500],
    marginTop: Spacing.md,
  },
  contactUnlocked: {
    backgroundColor: Colors.success[50],
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.success[100],
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  contactTitle: {
    fontSize: FontSize.h3,
    fontWeight: FontWeight.semiBold,
    color: Colors.success[700],
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  contactValue: {
    fontSize: FontSize.body,
    color: Colors.slate[800],
    fontWeight: FontWeight.medium,
  },
  contactActionRow: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.success[100],
  },
  contactActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  actionChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.success[100],
  },
  actionChipText: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.medium,
    color: Colors.success[700],
  },
  whatsappButton: {
    marginTop: Spacing.lg,
  },
  bottomPadding: {
    height: Spacing['3xl'],
  },
});
