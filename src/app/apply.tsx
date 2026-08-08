import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';

import { BodyText, DisplayText, Eyebrow, ScreenContainer, VesperButton, VesperInput } from '@/components/vesper-ui';
import { colors } from '@/constants/colors';
import { useAuth } from '@/lib/auth-context';

export default function ApplyScreen() {
  const { apply, status } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [occupation, setOccupation] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = name.trim() && email.trim().includes('@') && reason.trim().length > 0;

  async function handleSubmit() {
    if (!canSubmit || submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      await apply({ name, email, city, occupation, reason });
    } catch (e) {
      setError('Something went wrong submitting your application. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScreenContainer>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 72, paddingBottom: 48 }} keyboardShouldPersistTaps="handled">
          <Eyebrow>Vesper</Eyebrow>
          <DisplayText style={{ marginBottom: 6 }}>Life after six.</DisplayText>
          <BodyText style={{ color: colors.smokedOak, marginBottom: 36 }}>
            Vesper is invite-only. Tell us who you are — every application is read by a person,
            not a bot.
          </BodyText>

          {status === 'rejected' && (
            <Text style={{ color: colors.brass, fontFamily: 'Raleway_400Regular', marginBottom: 20 }}>
              Your last application wasn't approved. You're welcome to apply again.
            </Text>
          )}

          <VesperInput label="Full name" value={name} onChangeText={setName} placeholder="James Arnholt" autoCapitalize="words" />
          <VesperInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@email.com"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <VesperInput label="City" value={city} onChangeText={setCity} placeholder="Nashville, TN" autoCapitalize="words" />
          <VesperInput
            label="Occupation"
            value={occupation}
            onChangeText={setOccupation}
            placeholder="What you do"
            autoCapitalize="words"
          />
          <VesperInput
            label="Why Vesper"
            value={reason}
            onChangeText={setReason}
            placeholder="A couple sentences on why you want in"
            multiline
            numberOfLines={4}
            style={{ minHeight: 100, textAlignVertical: 'top' }}
          />

          {error && <Text style={{ color: '#D98C8C', marginBottom: 12, fontFamily: 'Raleway_400Regular' }}>{error}</Text>}

          <VesperButton label={submitting ? 'Submitting…' : 'Submit Application'} onPress={handleSubmit} loading={submitting} disabled={!canSubmit} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
