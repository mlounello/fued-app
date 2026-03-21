export interface AdminUserRow {
  id: string;
  email: string;
  displayName: string | null;
  isAdmin: boolean;
  isDisabled: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface AdminGameRow {
  id: string;
  title: string;
  ownerUserId: string;
  ownerEmail: string;
  status: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface StorageSummary {
  totalAssets: number;
  totalBytes: number;
}
