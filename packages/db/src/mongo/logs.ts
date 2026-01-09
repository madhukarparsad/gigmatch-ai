export interface ActivityLog {
  userId: string;
  event: string;

  metadata: Record<string, any>;

  createdAt: Date;
}
