import { z } from 'zod';

export const subscriptionSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.coerce.number().positive('Price must be positive'),
  currency: z.literal('INR').default('INR'),
  billingCycle: z.enum(['monthly', 'yearly', 'weekly']),
  category: z.enum(['entertainment', 'productivity', 'health', 'finance', 'education', 'other']),
  startDate: z.string().min(1),
  renewalDate: z.string().min(1),
  description: z.string().max(500).optional(),
});

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;
