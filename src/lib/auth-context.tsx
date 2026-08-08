import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { applicationsRepo, membersRepo, newId, seedIfNeeded } from './data';
import { getRaw, removeRaw, setRaw } from './repository';
import { ADMIN_EMAIL } from './seed';
import type { Application, Member } from './types';

const SESSION_KEY = 'vesper.session';

export type AuthStatus = 'loading' | 'guest' | 'pending' | 'rejected' | 'approved';

export interface ApplyInput {
  name: string;
  email: string;
  city: string;
  occupation: string;
  reason: string;
}

interface AuthContextValue {
  status: AuthStatus;
  email: string | null;
  member: Member | null;
  application: Application | null;
  isAdmin: boolean;
  apply: (input: ApplyInput) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [email, setEmail] = useState<string | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [application, setApplication] = useState<Application | null>(null);

  const refresh = useCallback(async () => {
    await seedIfNeeded();
    const session = await getRaw<{ email: string }>(SESSION_KEY);

    if (!session) {
      setStatus('guest');
      setEmail(null);
      setMember(null);
      setApplication(null);
      return;
    }

    const existingMember = await membersRepo.get(session.email);
    if (existingMember) {
      setEmail(session.email);
      setMember(existingMember);
      setApplication(null);
      setStatus('approved');
      return;
    }

    const applications = await applicationsRepo.all();
    const myApplication = applications.find((a) => a.email === session.email);

    setEmail(session.email);
    setMember(null);
    setApplication(myApplication ?? null);

    if (!myApplication) {
      setStatus('guest');
    } else if (myApplication.status === 'pending') {
      setStatus('pending');
    } else if (myApplication.status === 'rejected') {
      setStatus('rejected');
    } else {
      setStatus('approved');
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const apply = useCallback(
    async (input: ApplyInput) => {
      const normalizedEmail = input.email.trim().toLowerCase();
      const isAdmin = normalizedEmail === ADMIN_EMAIL.toLowerCase();
      const now = new Date().toISOString();

      const newApplication: Application = {
        id: newId(),
        email: normalizedEmail,
        name: input.name.trim(),
        city: input.city.trim(),
        occupation: input.occupation.trim(),
        reason: input.reason.trim(),
        status: isAdmin ? 'approved' : 'pending',
        isAdmin,
        submittedAt: now,
        decidedAt: isAdmin ? now : undefined,
      };

      await applicationsRepo.upsert(newApplication);

      if (isAdmin) {
        const newMember: Member = {
          id: normalizedEmail,
          email: normalizedEmail,
          name: newApplication.name || 'Hailey',
          city: newApplication.city,
          occupation: newApplication.occupation,
          bio: newApplication.reason,
          isAdmin: true,
          joinedAt: now,
        };
        await membersRepo.upsert(newMember);
      }

      await setRaw(SESSION_KEY, { email: normalizedEmail });
      await refresh();
    },
    [refresh]
  );

  const signOut = useCallback(async () => {
    await removeRaw(SESSION_KEY);
    await refresh();
  }, [refresh]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      email,
      member,
      application,
      isAdmin: member?.isAdmin ?? false,
      apply,
      signOut,
      refresh,
    }),
    [status, email, member, application, apply, signOut, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
