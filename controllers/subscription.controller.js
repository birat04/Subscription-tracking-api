import { workflowClient } from '../config/upstash.js';
import Subscription from '../models/subscription.js';

// Get a subscription by ID
export const getSubscriptionById = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      const error = new Error('Subscription not found');
      error.statusCode = 404;
      throw error;
    }
    if (String(subscription.user) !== String(req.user._id)) {
      const error = new Error('You are not authorized to view this subscription');
      error.statusCode = 403;
      throw error;
    }
    res.status(200).json({ success: true, data: subscription });
  } catch (e) {
    next(e);
  }
};

// Create a new subscription and trigger a workflow
export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    const SERVER_URL = process.env.SERVER_URL || 'http://your-server-url.com';

    await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`, 
      body: JSON.stringify({ subscriptionId: subscription._id }),
      headers: { 'Content-Type': 'application/json' },
      workflowRunId: subscription._id.toString(), 
      retries: 3, 
    });

    res.status(201).json({ success: true, data: subscription });
  } catch (e) {
    next(e);
  }
};

export const getUserSubscriptions = async (req, res, next) => {
  try {
    if (String(req.user._id) !== req.params.id) {
      const error = new Error('You are not the owner of this account');
      error.statusCode = 401;
      throw error;
    }

    const subscriptions = await Subscription.find({ user: req.params.id });
    res.status(200).json({ success: true, data: subscriptions });
  } catch (e) {
    next(e);
  }
};

export const updateSubscriptions = async (req, res, next) => {
  try {
    let subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      const error = new Error('Subscription not found');
      error.statusCode = 404;
      throw error;
    }
    if (String(subscription.user) !== String(req.user._id)) {
      const error = new Error('You are not authorized to update this subscription');
      error.statusCode = 403;
      throw error;
    }
    subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: subscription });
  } catch (e) {
    next(e);
  }
};

export const cancelSubscriptions = async (req, res, next) => {
  try {
    let subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      const error = new Error('Subscription not found');
      error.statusCode = 404;
      throw error;
    }
    if (String(subscription.user) !== String(req.user._id)) {
      const error = new Error('You are not authorized to cancel this subscription');
      error.statusCode = 403;
      throw error;
    }
    subscription.status = 'canceled';
    await subscription.save();

    res.status(200).json({ success: true, message: 'Subscription canceled successfully' });
  } catch (e) {
    next(e);
  }
};

export const deleteSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      const error = new Error('Subscription not found');
      error.statusCode = 404;
      throw error;
    }
    if (String(subscription.user) !== String(req.user._id)) {
      const error = new Error('You are not authorized to delete this subscription');
      error.statusCode = 403;
      throw error;
    }
    await subscription.deleteOne();
    res.status(200).json({ success: true, message: 'Subscription deleted successfully' });
  } catch (e) {
    next(e);
  }
};

export const getUpcomingRenewals = async (req, res, next) => {
  try {
    const today = new Date();
    const upcomingRenewals = await Subscription.find({
      user: req.user._id,
      nextBillingDate: { $gte: today },
    }).sort({ nextBillingDate: 1 });

    res.status(200).json({ success: true, data: upcomingRenewals });
  } catch (e) {
    next(e);
  }
};
