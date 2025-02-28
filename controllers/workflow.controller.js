import dayjs from 'dayjs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const REMINDERS = [7, 5, 2, 1];
const { serve } = require("@upstash/workflow/express");

import Subscription from '../models/subscription.js';
import { sendReminderEmail } from '../utils/send-email.js';

export const sendReminders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;
  const subscription = await getSubscriptionById(context, subscriptionId);

  if (!subscription || subscription.status !== 'active') return;

  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`);
    return;
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, 'day');

    if (reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
    }
    if(dayjs().isSame(reminderDate,'day')){
    await triggerReminder(context, `${daysBefore} days before reminder`,subscription);
    }
  }
});


export const getSubscriptionById = async (context, subscriptionId) => {
  return await context.run('get subscription', async () => {
    return Subscription.findById(subscriptionId).populate('user', 'name email');
  });
};

const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${label} reminder at ${date}`);
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label,subscription) => {
  return await context.run(label, async() => {
    console.log(`Triggering ${label} reminder`);
    await sendReminderEmail({
      to: subscription.user.email,
      type: label,
      subscription: {
        user: subscription.user,
        name: subscription.name,
        renewalDate: subscription.renewalDate,
        daysLeft: dayjs(subscription.renewalDate).diff(dayjs(), 'days'),
        currency: subscription.currency,
        price: subscription.price,
        frequency: subscription.frequency,
        paymentMethod: subscription.paymentMethod,
      },
    });

  });
};
