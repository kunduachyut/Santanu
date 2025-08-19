export interface Website {
  _id: string;
  title: string;
  url: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  approvedAt?: Date;
  rejectedAt?: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  // ... other fields
}