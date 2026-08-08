import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, View } from 'react-native';

import { BodyText, Card, DisplayText, Eyebrow, ScreenContainer, VesperButton } from '@/components/vesper-ui';
import { colors } from '@/constants/colors';
import { useAuth } from '@/lib/auth-context';
import { applicationsRepo, membersRepo } from '@/lib/data';
import type { Application } from '@/lib/types';

export default function ProfileScreen() {
  const { member, isAdmin, signOut } = useAuth();
  const [pendingApplications, setPendingApplications] = useState<Application[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isAdmin) return;
    const all = await applicationsRepo.all();
    setPendingApplications(all.filter((a) => a.status === 'pending').sort((a, b) => a.submittedAt.localeCompare(b.submittedAt)));
  }, [isAdmin]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function handleApprove(application: Application) {
    setBusyId(application.id);
    try {
      const now = new Date().toISOString();
      await applicationsRepo.upsert({ ...application, status: 'approved', decidedAt: now });
      await membersRepo.upsert({
        id: application.email,
        email: application.email,
        name: application.name,
        city: application.city,
        occupation: application.occupation,
        bio: application.reason,
        isAdmin: false,
        joinedAt: now,
      });
      await load();
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject(application: Application) {
    setBusyId(application.id);
    try {
      await applicationsRepo.upsert({ ...application, status: 'rejected', decidedAt: new Date().toISOString() });
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <ScreenContainer>
      <FlatList
        data={isAdmin ? pendingApplications : []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24, paddingTop: 72, paddingBottom: 48 }}
        ListHeaderComponent={
          <>
            <Eyebrow>Vesper</Eyebrow>
            <DisplayText style={{ marginBottom: 24 }}>{member?.name ?? 'Profile'}</DisplayText>

            <Card style={{ marginBottom: 24 }}>
              <BodyText style={{ color: colors.smokedOak, fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>
                Email
              </BodyText>
              <BodyText style={{ marginBottom: 16 }}>{member?.email}</BodyText>
              {!!member?.occupation && (
                <>
                  <BodyText style={{ color: colors.smokedOak, fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>
                    Occupation
                  </BodyText>
                  <BodyText style={{ marginBottom: 16 }}>{member.occupation}</BodyText>
                </>
              )}
              <VesperButton label="Sign Out" onPress={signOut} variant="ghost" />
            </Card>

            {isAdmin && (
              <>
                <Eyebrow>Review Queue</Eyebrow>
                <BodyText style={{ color: colors.smokedOak, marginBottom: 16 }}>
                  {pendingApplications.length} application{pendingApplications.length === 1 ? '' : 's'} waiting.
                </BodyText>
              </>
            )}
          </>
        }
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <Card>
            <BodyText style={{ fontSize: 17, marginBottom: 4 }}>{item.name}</BodyText>
            <BodyText style={{ color: colors.brass, fontSize: 13, marginBottom: 8 }}>{item.email}</BodyText>
            {!!item.occupation && <BodyText style={{ color: colors.smokedOak, fontSize: 13, marginBottom: 4 }}>{item.occupation}{item.city ? ` · ${item.city}` : ''}</BodyText>}
            {!!item.reason && <BodyText style={{ marginBottom: 16 }}>{item.reason}</BodyText>}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <VesperButton label="Approve" onPress={() => handleApprove(item)} loading={busyId === item.id} />
              </View>
              <View style={{ flex: 1 }}>
                <VesperButton label="Reject" onPress={() => handleReject(item)} variant="ghost" loading={busyId === item.id} />
              </View>
            </View>
          </Card>
        )}
      />
    </ScreenContainer>
  );
}
