import React from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  TextInputProps as RNTextInputProps,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../constants';

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export function TextInput({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  containerStyle,
  style,
  editable = true,
  ...props
}: TextInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  const inputStyles: StyleProp<TextStyle>[] = [styles.input];
  if (leftIcon) inputStyles.push(styles.inputWithLeftIcon);
  if (rightIcon) inputStyles.push(styles.inputWithRightIcon);
  if (!editable) inputStyles.push(styles.inputDisabled);
  if (style) inputStyles.push(style as TextStyle);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
          !editable && styles.inputContainerDisabled,
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        
        <RNTextInput
          style={inputStyles}
          placeholderTextColor={Colors.slate[400]}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          editable={editable}
          {...props}
        />
        
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
      
      {error && <Text style={styles.error}>{error}</Text>}
      {hint && !error && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
    color: Colors.slate[700],
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.slate[200],
    borderRadius: BorderRadius.md,
    minHeight: 48,
  },
  inputContainerFocused: {
    borderWidth: 2,
    borderColor: Colors.primary[600],
  },
  inputContainerError: {
    borderColor: Colors.error[600],
    backgroundColor: Colors.error[50],
  },
  inputContainerDisabled: {
    backgroundColor: Colors.slate[50],
  },
  input: {
    flex: 1,
    fontSize: FontSize.body,
    color: Colors.slate[900],
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  inputDisabled: {
    color: Colors.slate[500],
  },
  iconLeft: {
    paddingLeft: Spacing.lg,
  },
  iconRight: {
    paddingRight: Spacing.lg,
  },
  error: {
    fontSize: FontSize.caption,
    color: Colors.error[600],
    marginTop: Spacing.xs,
  },
  hint: {
    fontSize: FontSize.caption,
    color: Colors.slate[500],
    marginTop: Spacing.xs,
  },
});
