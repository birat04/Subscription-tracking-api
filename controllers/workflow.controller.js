
import {creteRequire} from 'module';
const require = creteRequire(import.meta.url);
import { serve } from "@upstash/workflow/express";

export const sendReminders = serve(async () => {
    const {subscriptionId} = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);
});