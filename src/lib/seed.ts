import type { Member } from './types';

export const ADMIN_EMAIL = 'hdc@pulchritudemedia.com';

export const seedMembers: Member[] = [
  {
    id: 'seed-1',
    email: 'james.arnholt@example.com',
    name: 'James Arnholt',
    city: 'Nashville, TN',
    occupation: 'Structural Engineer',
    bio: 'Rebuilding a discipline around lifting and Scripture after a few lost years. Coffee, not protein shakes.',
    isAdmin: false,
    joinedAt: '2026-07-02T12:00:00.000Z',
  },
  {
    id: 'seed-2',
    email: 'theo.marsh@example.com',
    name: 'Theo Marsh',
    city: 'Denver, CO',
    occupation: 'Product Designer',
    bio: 'Trying to build a career that doesn’t eat the rest of my life. Married, one kid, always cold.',
    isAdmin: false,
    joinedAt: '2026-07-05T12:00:00.000Z',
  },
  {
    id: 'seed-3',
    email: 'daniel.ochoa@example.com',
    name: 'Daniel Ochoa',
    city: 'Austin, TX',
    occupation: 'Physical Therapist',
    bio: 'Came back to church two years ago. Still figuring out what a serious faith looks like on a Tuesday.',
    isAdmin: false,
    joinedAt: '2026-07-09T12:00:00.000Z',
  },
  {
    id: 'seed-4',
    email: 'will.hutchins@example.com',
    name: 'Will Hutchins',
    city: 'Charlotte, NC',
    occupation: 'Attorney',
    bio: 'Reader first, everything else second. Currently on my third pass through Chesterton.',
    isAdmin: false,
    joinedAt: '2026-07-14T12:00:00.000Z',
  },
  {
    id: 'seed-5',
    email: 'sam.ferreira@example.com',
    name: 'Sam Ferreira',
    city: 'Chicago, IL',
    occupation: 'Firefighter',
    bio: 'Here for the people as much as the goals. Looking for men who’ll actually check in on me.',
    isAdmin: false,
    joinedAt: '2026-07-20T12:00:00.000Z',
  },
];
