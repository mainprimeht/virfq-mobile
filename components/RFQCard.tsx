import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  Colors, 
  Spacing, 
  FontSize, 
  FontWeight, 
  BorderRadius,
  Shadows,
  getQualityScoreColor,
} from '../constants';
import { QualityScoreBadge, StatusBadge, CategoryBadge } from './Badge';
import type { RFQ } from '../types';

interface RFQCardProps {
  rfq: RFQ;
  onPress: () => void;
  locale?: 'vi' | 'en';
}

export function RFQCard({ rfq, onPress, locale = 'vi' }: RFQCardProps) {
  const title = locale === 'vi' && rfq.translationVi?.titleVi
    ? rfq.translationVi.titleVi
    : rfq.titleEn;

  const category = locale === 'vi'
    ? rfq.productCategory?.nameVi
    : rfq.productCategory?.nameEn;

  const formatTimeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (locale === 'vi') {
      if (diffMins < 60) return `${diffMins} phút trước`;
      if (diffHours < 24) return `${diffHours} giờ trước`;
      if (diffDays < 7) return `${diffDays} ngày trước`;
      return date.toLocaleDateString('vi-VN');
    } else {
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString('en-US');
    }
  };

  const isNew = new Date().getTime() - new Date(rfq.createdAt).getTime() < 24 * 60 * 60 * 1000;
  const isHot = rfq.qualityScore && rfq.qualityScore >= 80;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header: Category + Badges */}
      <View style={styles.header}>
        <View style={styles.badgesRow}>
          {category && <CategoryBadge name={category} />}
          {isHot && <StatusBadge type="hot" />}
          {isNew && !isHot && <StatusBadge type="new" />}
          {rfq.isFeatured && <StatusBadge type="verified" />}
        </View>
        {rfq.qualityScore && (
          <QualityScoreBadge score={rfq.qualityScore} size="sm" />
        )}
      </View>

      {/* Title */}
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>

      {/* Details Row */}
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailText}>
            🌍 {rfq.buyerCountry}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailText}>
            📦 {rfq.quantity} {rfq.quantityUnit}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailText}>
            🚢 {rfq.incoterms}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.lockInfo}>
          <Ionicons name="lock-closed" size={14} color={Colors.slate[400]} />
          <Text style={styles.lockText}>
            {locale === 'vi' ? 'Thông tin liên hệ' : 'Contact info'}
          </Text>
        </View>
        <Text style={styles.timeAgo}>
          ⏱️ {formatTimeAgo(rfq.createdAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.slate[200],
    ...Shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    flex: 1,
  },
  title: {
    fontSize: FontSize.h3,
    fontWeight: FontWeight.semiBold,
    color: Colors.slate[800],
    marginBottom: Spacing.md,
    lineHeight: 24,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: FontSize.body,
    color: Colors.slate[500],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.slate[100],
  },
  lockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  lockText: {
    fontSize: FontSize.body,
    color: Colors.slate[400],
  },
  timeAgo: {
    fontSize: FontSize.caption,
    color: Colors.slate[400],
  },
});
