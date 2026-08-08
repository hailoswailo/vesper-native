import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView } from 'react-native';

import { BodyText, Card, DisplayText, Eyebrow, ScreenContainer } from '@/components/vesper-ui';
import { colors } from '@/constants/colors';
import { useAuth } from '@/lib/auth-context';
import { goalsRepo } from '@/lib/data';
import type { Goal } from '@/lib/types';

function timeOfDayGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return 'Good evening';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Vespers';
}

export default function HomeScreen() {
  const { member } = useAuth();
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null);

  const load = useCallback(async () => {
    if (!member) return;
    const all = await goalsRepo.all();
    const mine = all.filter((g) => g.memberEmail === member.email && g.active);
    setActiveGoal(mine[0] ?? null);
  }, [member]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const firstName = member?.name?.split(' ')[0] ?? 'there';

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 72, paddingBottom: 48 }}>
        <Eyebrow>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</Eyebrow>
        <DisplayText style={{ marginBottom: 32 }}>
          {timeOfDayGreeting()}, {firstName}.
        </DisplayText>

        <Card style={{ marginBottom: 16 }}>
          <Eyebrow>Active Goal</Eyebrow>
          {activeGoal ? (
            <>
              <BodyText style={{ fontSize: 18, marginBottom: 6 }}>{activeGoal.title}</BodyText>
              <BodyText style={{ color: colors.smokedOak }}>{activeGoal.pillar}</BodyText>
            </>
          ) : (
            <BodyText style={{ color: colors.smokedOak }}>
              No active goal yet. Set one from the Goals tab — one line, always visible.
            </BodyText>
          )}
        </Card>

        <Card>
          <Eyebrow>Streak</Eyebrow>
          <DisplayText style={{ fontSize: 40, marginBottom: 4 }}>{activeGoal?.streak ?? 0}</DisplayText>
          <BodyText style={{ color: colors.smokedOak }}>
            {activeGoal ? 'days of consecutive check-ins' : 'begins once you check in for the first time'}
          </BodyText>
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
}
