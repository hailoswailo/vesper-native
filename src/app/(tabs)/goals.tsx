import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';

import { BodyText, Card, DisplayText, Eyebrow, ScreenContainer, VesperButton, VesperInput } from '@/components/vesper-ui';
import { colors, pillars, type Pillar } from '@/constants/colors';
import { useAuth } from '@/lib/auth-context';
import { goalsRepo, newId } from '@/lib/data';
import type { Goal } from '@/lib/types';

function isSameDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString();
}

function isYesterday(a: Date, b: Date): boolean {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((b.setHours(0, 0, 0, 0) - a.setHours(0, 0, 0, 0)) / oneDay) === 1;
}

export default function GoalsScreen() {
  const { member } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [pillar, setPillar] = useState<Pillar>('Faith');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!member) return;
    const all = await goalsRepo.all();
    const mine = all
      .filter((g) => g.memberEmail === member.email)
      .sort((a, b) => Number(b.active) - Number(a.active));
    setGoals(mine);
  }, [member]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function handleCreate() {
    if (!member || !title.trim() || saving) return;
    setSaving(true);
    try {
      const goal: Goal = {
        id: newId(),
        memberEmail: member.email,
        pillar,
        title: title.trim(),
        active: true,
        streak: 0,
        createdAt: new Date().toISOString(),
      };
      await goalsRepo.upsert(goal);
      setTitle('');
      setShowForm(false);
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function handleCheckIn(goal: Goal) {
    const now = new Date();
    const last = goal.lastCheckedInAt ? new Date(goal.lastCheckedInAt) : null;

    if (last && isSameDay(last, now)) return; // already checked in today

    const continuesStreak = last ? isYesterday(new Date(last), new Date(now)) : false;
    const updated: Goal = {
      ...goal,
      streak: continuesStreak ? goal.streak + 1 : 1,
      lastCheckedInAt: now.toISOString(),
    };
    await goalsRepo.upsert(updated);
    await load();
  }

  async function handleSetActive(goal: Goal) {
    const all = await goalsRepo.all();
    const mine = all.filter((g) => g.memberEmail === member?.email);
    for (const g of mine) {
      if (g.id === goal.id && !g.active) {
        await goalsRepo.upsert({ ...g, active: true });
      } else if (g.id !== goal.id && g.active) {
        await goalsRepo.upsert({ ...g, active: false });
      }
    }
    await load();
  }

  return (
    <ScreenContainer>
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24, paddingTop: 72, paddingBottom: 48 }}
        ListHeaderComponent={
          <>
            <Eyebrow>Vesper</Eyebrow>
            <DisplayText style={{ marginBottom: 8 }}>Goals</DisplayText>
            <BodyText style={{ color: colors.smokedOak, marginBottom: 24 }}>
              One goal, always visible. Check in daily to build your streak.
            </BodyText>

            {showForm ? (
              <Card style={{ marginBottom: 20 }}>
                <VesperInput label="Goal" value={title} onChangeText={setTitle} placeholder="Train four days a week" />
                <BodyText style={{ color: colors.smokedOak, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>
                  Pillar
                </BodyText>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                  {pillars.map((p) => (
                    <Pressable
                      key={p}
                      onPress={() => setPillar(p)}
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 14,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: pillar === p ? colors.brass : 'rgba(197,169,106,0.3)',
                        backgroundColor: pillar === p ? 'rgba(197,169,106,0.15)' : 'transparent',
                      }}
                    >
                      <BodyText style={{ color: pillar === p ? colors.brass : colors.smokedOak, fontSize: 13 }}>{p}</BodyText>
                    </Pressable>
                  ))}
                </View>
                <VesperButton label={saving ? 'Saving…' : 'Save Goal'} onPress={handleCreate} loading={saving} disabled={!title.trim()} />
              </Card>
            ) : (
              <VesperButton label="+ New Goal" onPress={() => setShowForm(true)} variant="ghost" />
            )}
            <View style={{ height: 20 }} />
          </>
        }
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => {
          const checkedInToday = item.lastCheckedInAt ? isSameDay(new Date(item.lastCheckedInAt), new Date()) : false;
          return (
            <Card>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <BodyText style={{ fontSize: 17, marginBottom: 4 }}>{item.title}</BodyText>
                  <BodyText style={{ color: colors.brass, fontSize: 12, marginBottom: 4 }}>{item.pillar}</BodyText>
                  <BodyText style={{ color: colors.smokedOak, fontSize: 13 }}>{item.streak} day streak</BodyText>
                </View>
                {!item.active && (
                  <Pressable onPress={() => handleSetActive(item)}>
                    <BodyText style={{ color: colors.smokedOak, fontSize: 12, textDecorationLine: 'underline' }}>Make active</BodyText>
                  </Pressable>
                )}
              </View>
              {item.active && (
                <View style={{ marginTop: 16 }}>
                  <VesperButton
                    label={checkedInToday ? 'Checked in today' : 'Check in'}
                    onPress={() => handleCheckIn(item)}
                    disabled={checkedInToday}
                    variant={checkedInToday ? 'ghost' : 'primary'}
                  />
                </View>
              )}
            </Card>
          );
        }}
        ListEmptyComponent={
          !showForm ? (
            <BodyText style={{ color: colors.smokedOak }}>No goals yet. Add one above.</BodyText>
          ) : null
        }
      />
    </ScreenContainer>
  );
}
