import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadows } from '../constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'cta' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  fullWidth = true,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const getBackgroundColor = () => {
    if (isDisabled) return Colors.slate[300];
    switch (variant) {
      case 'primary':
        return Colors.primary[600];
      case 'cta':
        return Colors.cta.DEFAULT;
      case 'secondary':
        return Colors.slate[100];
      case 'outline':
      case 'ghost':
        return 'transparent';
      case 'danger':
        return Colors.error[600];
      default:
        return Colors.primary[600];
    }
  };

  const getTextColor = () => {
    if (isDisabled && (variant === 'outline' || variant === 'ghost')) {
      return Colors.slate[400];
    }
    switch (variant) {
      case 'primary':
      case 'cta':
      case 'danger':
        return Colors.white;
      case 'secondary':
        return Colors.slate[700];
      case 'outline':
        return Colors.primary[600];
      case 'ghost':
        return Colors.primary[600];
      default:
        return Colors.white;
    }
  };

  const getBorderStyle = () => {
    if (variant === 'outline') {
      return {
        borderWidth: 1,
        borderColor: isDisabled ? Colors.slate[300] : Colors.primary[600],
      };
    }
    if (variant === 'secondary') {
      return {
        borderWidth: 1,
        borderColor: Colors.slate[200],
      };
    }
    return {};
  };

  const getShadow = () => {
    if (isDisabled || variant === 'ghost' || variant === 'outline') {
      return {};
    }
    if (variant === 'cta') {
      return {
        ...Shadows.lg,
        shadowColor: Colors.cta.DEFAULT,
        shadowOpacity: 0.3,
      };
    }
    return Shadows.md;
  };

  const buttonStyles = [
    styles.base,
    styles[`size_${size}`],
    { backgroundColor: getBackgroundColor() },
    getBorderStyle(),
    getShadow(),
    fullWidth && styles.fullWidth,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${size}`],
    { color: getTextColor() },
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={getTextColor()}
          size="small"
        />
      ) : (
        <>
          {icon}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  fullWidth: {
    width: '100%',
  },
  
  // Sizes
  size_sm: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  size_md: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  size_lg: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing['2xl'],
  },
  
  // Text
  text: {
    fontWeight: FontWeight.semiBold,
  },
  text_sm: {
    fontSize: FontSize.body,
  },
  text_md: {
    fontSize: FontSize.bodyLarge,
  },
  text_lg: {
    fontSize: FontSize.h3,
  },
});
