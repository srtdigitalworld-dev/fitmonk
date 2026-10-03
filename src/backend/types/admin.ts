import type { AdminRole } from './common';

export interface AdminEntity {
  id: string;
  email: string;
  name: string;
  roleId: AdminRole;
  isActive: boolean;
  lastLoginAt: number | null;
  failedAttempts: number;
  lockedUntil: number | null;
  createdAt: number;
  updatedAt: number;
}

export interface AdminSessionEntity {
  id: string;
  adminId: string;
  tokenHash: string;
  ipAddress: string | null;
  userAgent: string | null;
  expiresAt: number;
  createdAt: number;
}

export interface AuthContext {
  admin: AdminEntity;
  session: AdminSessionEntity;
}
