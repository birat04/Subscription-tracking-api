import { Router } from "express";

const workflowRouter = Router();

import Subscription from '../models/subscription.js';

export const sendReminders = async (req, res, next) => {
    try {
        const qstashSecret = req.headers['x-qstash-secret'];
        if (qstashSecret !== process.env.QSTASH_SECRET) {
            return res.status(401).json({ message: 'Unauthorized QStash access' });
        }
        
        const { subscriptionId } = req.body;
        if (!subscriptionId) {
            return res.status(400).json({ message: 'Missing subscriptionId in request body' });
        }
        
        const subscription = await Subscription.findById(subscriptionId);
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        
        workflowRouter.post('/subscription/reminder', sendReminders);
        // Add your actual reminder logic here (email, push, etc.)
        console.log(`🔔 Reminder sent for subscription: ${subscription.name}`);
        
        res.status(200).json({ success: true, message: 'Reminder triggered successfully' });
    } catch (err) {
        next(err);
    }
};

export default workflowRouter;