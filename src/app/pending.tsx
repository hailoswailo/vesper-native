import React from 'react';
import { View } from 'react-native';

import { BodyText, DisplayText, Eyebrow, ScreenContainer, VesperButton } from '@/components/vesper-ui';
import { colors } from '@/constants/colors';
import { useAuth } from '@/lib/auth-context';

export default function PendingScreen() {
  const { application, signOut } = useAuth();

  return (
    <ScreenContainer style={{ alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <View style={{ alignItems: 'center', maxWidth: 340 }}>
        <Eyebrow>Application received</Eyebrow>
        <DisplayText style={{ textAlign: 'center', marginBottom: 14 }}>
          {application?.name ? `Thank you, ${application.name.split(' ')[0]}.` : 'Thank you.'}
        </DisplayText>
        <BodyText style={{ color: colors.smokedOak, textAlign: 'center', marginBottom: 40 }}>
          Someone reads every application by hand. If it's a fit, you'll hear back soon — this
          isn't automatic, so it may take a few days.
        </BodyText>
        <VesperButton label="Use a different email" onPress={signOut} variant="ghost" />
      </View>
    </ScreenContainer>
  );
}
