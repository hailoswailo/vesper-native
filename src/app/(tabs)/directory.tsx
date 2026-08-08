import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList } from 'react-native';

import { BodyText, Card, DisplayText, Eyebrow, ScreenContainer } from '@/components/vesper-ui';
import { colors } from '@/constants/colors';
import { useAuth } from '@/lib/auth-context';
import { membersRepo } from '@/lib/data';
import type { Member } from '@/lib/types';

export default function DirectoryScreen() {
  const { member: currentMember } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);

  const load = useCallback(async () => {
    const all = await membersRepo.all();
    const others = all
      .filter((m) => m.email !== currentMember?.email)
      .sort((a, b) => a.name.localeCompare(b.name));
    setMembers(others);
  }, [currentMember]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <ScreenContainer>
      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24, paddingTop: 72, paddingBottom: 48 }}
        ListHeaderComponent={
          <>
            <Eyebrow>Vesper</Eyebrow>
            <DisplayText style={{ marginBottom: 8 }}>Directory</DisplayText>
            <BodyText style={{ color: colors.smokedOak, marginBottom: 28 }}>
              {members.length} {members.length === 1 ? 'man' : 'men'} in the circle.
            </BodyText>
          </>
        }
        ItemSeparatorComponent={() => <BodyText style={{ height: 12 }}> </BodyText>}
        renderItem={({ item }) => (
          <Card>
            <BodyText style={{ fontSize: 17, marginBottom: 4 }}>{item.name}</BodyText>
            <BodyText style={{ color: colors.brass, fontSize: 13, marginBottom: 8 }}>{item.occupation}</BodyText>
            {!!item.city && <BodyText style={{ color: colors.smokedOak, fontSize: 13, marginBottom: 8 }}>{item.city}</BodyText>}
            {!!item.bio && <BodyText>{item.bio}</BodyText>}
          </Card>
        )}
        ListEmptyComponent={<BodyText style={{ color: colors.smokedOak }}>No one else here yet.</BodyText>}
      />
    </ScreenContainer>
  );
}
