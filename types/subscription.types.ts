export type BillingCycle = 'monthly' | 'yearly' | 'weekly';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'paused';
export type SubscriptionCategory =
  | 'entertainment'
  | 'productivity'
  | 'health'
  | 'finance'
  | 'education'
  | 'other';

export interface Subscription {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingCycle: BillingCycle;
  category: SubscriptionCategory;
  status: SubscriptionStatus;
  startDate: string;
  renewalDate: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}
