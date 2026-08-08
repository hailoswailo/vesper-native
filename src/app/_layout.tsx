import {
  CormorantGaramond_500Medium_Italic,
  CormorantGaramond_600SemiBold,
  useFonts as useDisplayFonts,
} from '@expo-google-fonts/cormorant-garamond';
import { Raleway_400Regular, Raleway_500Medium, Raleway_600SemiBold, useFonts as useBodyFonts } from '@expo-google-fonts/raleway';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { colors } from '@/constants/colors';
import { AuthProvider, useAuth } from '@/lib/auth-context';

function RootNavigator() {
  const { status } = useAuth();

  if (status === 'loading') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.midnight, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.brass} />
      </View>
    );
  }

  const isApproved = status === 'approved';
  const isPending = status === 'pending';
  const needsToApply = status === 'guest' || status === 'rejected';

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.midnight } }}>
      <Stack.Protected guard={isApproved}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={isPending}>
        <Stack.Screen name="pending" />
      </Stack.Protected>
      <Stack.Protected guard={needsToApply}>
        <Stack.Screen name="apply" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [displayFontsLoaded] = useDisplayFonts({
    CormorantGaramond_600SemiBold,
    CormorantGaramond_500Medium_Italic,
  });
  const [bodyFontsLoaded] = useBodyFonts({
    Raleway_400Regular,
    Raleway_500Medium,
    Raleway_600SemiBold,
  });

  const fontsLoaded = displayFontsLoaded && bodyFontsLoaded;

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.midnight, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.brass} />
      </View>
    );
  }

  return (
    <AuthProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </AuthProvider>
  );
}
