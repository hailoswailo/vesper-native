import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewProps,
} from 'react-native';

import { colors, fonts } from '@/constants/colors';

export function ScreenContainer({ style, ...props }: ViewProps) {
  return <View {...props} style={[styles.screen, style]} />;
}

export function Card({ style, ...props }: ViewProps) {
  return <View {...props} style={[styles.card, style]} />;
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <Text style={styles.eyebrow}>{children}</Text>;
}

export function DisplayText({ children, style }: { children: React.ReactNode; style?: any }) {
  return <Text style={[styles.display, style]}>{children}</Text>;
}

export function BodyText({ children, style }: { children: React.ReactNode; style?: any }) {
  return <Text style={[styles.body, style]}>{children}</Text>;
}

interface VesperButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'ghost';
  disabled?: boolean;
}

export function VesperButton({ label, onPress, loading, variant = 'primary', disabled }: VesperButtonProps) {
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.buttonPrimary : styles.buttonGhost,
        (disabled || loading) && { opacity: 0.5 },
        pressed && { opacity: 0.85 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.midnight : colors.brass} />
      ) : (
        <Text style={[styles.buttonLabel, isPrimary ? styles.buttonLabelPrimary : styles.buttonLabelGhost]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

export function VesperInput(props: TextInputProps & { label: string }) {
  const { label, style, ...rest } = props;
  return (
    <View style={{ marginBottom: 18 }}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        placeholderTextColor="rgba(245,241,232,0.35)"
        style={[styles.input, style]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.midnight,
  },
  card: {
    backgroundColor: colors.navy,
    borderRadius: 14,
    padding: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(197,169,106,0.25)',
  },
  eyebrow: {
    fontFamily: fonts.label,
    color: colors.brass,
    fontSize: 12,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  display: {
    fontFamily: fonts.display,
    color: colors.ivory,
    fontSize: 32,
  },
  body: {
    fontFamily: fonts.body,
    color: colors.ivory,
    fontSize: 15,
    lineHeight: 22,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: colors.brass,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(197,169,106,0.5)',
  },
  buttonLabel: {
    fontFamily: fonts.label,
    fontSize: 13,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  buttonLabelPrimary: {
    color: colors.midnight,
  },
  buttonLabelGhost: {
    color: colors.brass,
  },
  inputLabel: {
    fontFamily: fonts.label,
    color: colors.smokedOak,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  input: {
    fontFamily: fonts.body,
    color: colors.ivory,
    fontSize: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(197,169,106,0.35)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
});
