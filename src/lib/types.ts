import type { Pillar } from '@/constants/colors';

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface Application {
  id: string;
  email: string;
  name: string;
  city: string;
  occupation: string;
  reason: string; // why they want to join
  status: ApplicationStatus;
  isAdmin: boolean;
  submittedAt: string; // ISO date
  decidedAt?: string;
}

export interface Member {
  id: string;
  email: string;
  name: string;
  city: string;
  occupation: string;
  bio: string;
  isAdmin: boolean;
  joinedAt: string; // ISO date
}

export interface Goal {
  id: string;
  memberEmail: string;
  pillar: Pillar;
  title: string;
  active: boolean;
  streak: number;
  lastCheckedInAt?: string; // ISO date
  createdAt: string;
}

export interface Session {
  email: string;
}
