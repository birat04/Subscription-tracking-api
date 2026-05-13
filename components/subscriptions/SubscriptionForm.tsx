'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { subscriptionSchema, type SubscriptionFormData } from '@/schemas/subscription.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Props = {
  defaultValues?: Partial<SubscriptionFormData>;
  onSubmit: (data: SubscriptionFormData) => void | Promise<void>;
  submitLabel?: string;
  isSubmitting?: boolean;
};

const empty: SubscriptionFormData = {
  name: '',
  price: 99,
  currency: 'INR',
  billingCycle: 'monthly',
  category: 'other',
  startDate: '',
  renewalDate: '',
  description: '',
};

export function SubscriptionForm({ defaultValues, onSubmit, submitLabel = 'Save', isSubmitting }: Props) {
  const form = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: { ...empty, ...defaultValues, currency: 'INR' },
  });

  return (
    <form
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit({ ...values, currency: 'INR' });
      })}
      className="mx-auto flex max-w-xl flex-col gap-5"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...form.register('name')} />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Price (INR)</Label>
          <Input id="price" type="number" step="1" min={1} {...form.register('price')} />
          {form.formState.errors.price && (
            <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Billing cycle</Label>
          <Controller
            control={form.control}
            name="billingCycle"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Controller
          control={form.control}
          name="category"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="productivity">Productivity</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start date</Label>
          <Input id="startDate" type="date" {...form.register('startDate')} />
          {form.formState.errors.startDate && (
            <p className="text-sm text-destructive">{form.formState.errors.startDate.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="renewalDate">Renewal date</Label>
          <Input id="renewalDate" type="date" {...form.register('renewalDate')} />
          {form.formState.errors.renewalDate && (
            <p className="text-sm text-destructive">{form.formState.errors.renewalDate.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea id="description" rows={3} {...form.register('description')} />
        {form.formState.errors.description && (
          <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting || form.formState.isSubmitting}>
        {isSubmitting || form.formState.isSubmitting ? 'Saving…' : submitLabel}
      </Button>
    </form>
  );
}
