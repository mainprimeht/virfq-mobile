import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  Colors, 
  Spacing, 
  BorderRadius, 
  FontSize, 
  FontWeight,
  getQualityScoreColor 
} from '../constants';

interface QualityScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function QualityScoreBadge({ 
  score, 
  size = 'md',
  showLabel = false 
}: QualityScoreBadgeProps) {
  const color = getQualityScoreColor(score);
  
  const sizeStyles = {
    sm: { 
      container: styles.containerSm,
      icon: 12,
      text: styles.textSm,
    },
    md: { 
      container: styles.containerMd,
      icon: 14,
      text: styles.textMd,
    },
    lg: { 
      container: styles.containerLg,
      icon: 18,
      text: styles.textLg,
    },
  };

  const current = sizeStyles[size];

  return (
    <View style={[styles.container, current.container, { backgroundColor: color }]}>
      <Ionicons name="trophy" size={current.icon} color={Colors.white} />
      <Text style={[styles.text, current.text]}>{score}</Text>
      {showLabel && <Text style={[styles.label, current.text]}>/100</Text>}
    </View>
  );
}

interface StatusBadgeProps {
  type: 'new' | 'hot' | 'earlyAccess' | 'verified';
}

export function StatusBadge({ type }: StatusBadgeProps) {
  const config = {
    new: {
      label: 'NEW',
      bg: Colors.success[100],
      color: Colors.success[600],
      icon: null,
    },
    hot: {
      label: 'HOT',
      bg: Colors.warning[100],
      color: Colors.warning[600],
      icon: null,
    },
    earlyAccess: {
      label: '🔥 Early Access',
      bg: Colors.warning[100],
      color: Colors.warning[600],
      icon: null,
    },
    verified: {
      label: '✓ Verified',
      bg: 'transparent',
      color: Colors.success[600],
      icon: null,
    },
  };

  const { label, bg, color } = config[type];

  return (
    <View style={[styles.statusBadge, { backgroundColor: bg }]}>
      <Text style={[styles.statusText, { color }]}>{label}</Text>
    </View>
  );
}

interface CategoryBadgeProps {
  name: string;
}

export function CategoryBadge({ name }: CategoryBadgeProps) {
  return (
    <View style={styles.categoryBadge}>
      <Text style={styles.categoryText}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
  },
  containerSm: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    gap: 2,
  },
  containerMd: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    gap: Spacing.xs,
  },
  containerLg: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  text: {
    color: Colors.white,
    fontWeight: FontWeight.semiBold,
  },
  textSm: {
    fontSize: FontSize.tiny,
  },
  textMd: {
    fontSize: FontSize.caption,
  },
  textLg: {
    fontSize: FontSize.bodyLarge,
  },
  label: {
    color: Colors.white,
    opacity: 0.8,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: FontSize.tiny,
    fontWeight: FontWeight.bold,
  },
  categoryBadge: {
    backgroundColor: Colors.slate[100],
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md - 2,
    borderWidth: 1,
    borderColor: Colors.slate[200],
  },
  categoryText: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.medium,
    color: Colors.slate[600],
  },
});
