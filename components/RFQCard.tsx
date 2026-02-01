import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants';
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        {category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        )}
        {rfq.isFeatured && (
          <View style={styles.featuredBadge}>
            <Ionicons name="star" size={12} color="#fff" />
          </View>
        )}
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="cube-outline" size={16} color={Colors.light.textSecondary} />
          <Text style={styles.detailText}>
            {rfq.quantity} {rfq.quantityUnit}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color={Colors.light.textSecondary} />
          <Text style={styles.detailText}>{rfq.buyerCountry}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="boat-outline" size={16} color={Colors.light.textSecondary} />
          <Text style={styles.detailText}>{rfq.incoterms}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.date}>{formatDate(rfq.createdAt)}</Text>
        <Ionicons name="chevron-forward" size={20} color={Colors.light.textMuted} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    backgroundColor: Colors.light.primary + '15',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
  },
  categoryText: {
    fontSize: FontSize.xs,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  featuredBadge: {
    backgroundColor: Colors.light.warning,
    padding: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.sm,
    lineHeight: 24,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  detailText: {
    fontSize: FontSize.sm,
    color: Colors.light.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: Spacing.sm,
  },
  date: {
    fontSize: FontSize.xs,
    color: Colors.light.textMuted,
  },
});
