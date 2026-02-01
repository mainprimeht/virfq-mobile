import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Colors, Spacing, FontSize } from '../constants';

interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
}

export function Loading({ text, fullScreen = false }: LoadingProps) {
  if (fullScreen) {
    return (
      <View style={styles.fullScreen}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        {text && <Text style={styles.text}>{text}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.inline}>
      <ActivityIndicator size="small" color={Colors.light.primary} />
      {text && <Text style={styles.textInline}>{text}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
  },
  text: {
    marginTop: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.light.textSecondary,
  },
  textInline: {
    marginLeft: Spacing.sm,
    fontSize: FontSize.sm,
    color: Colors.light.textSecondary,
  },
});
