export interface SettingEntity {
  id: string;
  groupName: string;
  keyName: string;
  value: string;
  isEncrypted: boolean;
  updatedAt: number;
}

export interface AuditLogEntity {
  id: string;
  adminId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: number;
}
