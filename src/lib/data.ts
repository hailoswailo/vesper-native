import { AsyncStorageRepository, getRaw, setRaw } from './repository';
import { seedMembers } from './seed';
import type { Application, Goal, Member } from './types';

export const applicationsRepo = new AsyncStorageRepository<Application>('vesper.applications');
export const membersRepo = new AsyncStorageRepository<Member>('vesper.members');
export const goalsRepo = new AsyncStorageRepository<Goal>('vesper.goals');

const SEED_FLAG_KEY = 'vesper.seeded';

/** Seeds five demo members once so the Directory isn't empty on a fresh install. */
export async function seedIfNeeded(): Promise<void> {
  const alreadySeeded = await getRaw<boolean>(SEED_FLAG_KEY);
  if (alreadySeeded) return;

  const existing = await membersRepo.all();
  if (existing.length === 0) {
    for (const member of seedMembers) {
      await membersRepo.upsert(member);
    }
  }
  await setRaw(SEED_FLAG_KEY, true);
}

export function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
