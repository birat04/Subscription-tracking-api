import { workflowClient } from '../config/upstash.js';
import Subscription from '../models/subscription.js';
import { AppError } from '../middleware/error.middleware.js';
import mongoose from 'mongoose';

export const getSubscriptionById = async (req, res, next) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);

    const secret = req.headers['x-qstash-secret'];
    if (secret !== process.env.QSTASH_SECRET) {
      throw new AppError('Unauthorized - Invalid QStash secret', 401);
    }

    const { subscriptionId } = req.body;
    console.log('Subscription ID:', subscriptionId);
    
    // Validate subscription ID format
    if (!subscriptionId || !mongoose.Types.ObjectId.isValid(subscriptionId)) {
      console.log('Invalid subscription ID format');
      throw new AppError('Invalid subscription ID format', 400);
    }

    console.log('Looking up subscription with ID:', subscriptionId);
    const subscription = await Subscription.findById(subscriptionId)
      .populate('user', 'name email')
      .select('+status +renewalDate');
      
    console.log('Found subscription:', subscription);
    
    if (!subscription) {
      console.log('Subscription not found in database');
      throw new AppError('Subscription not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: {
        subscription
      }
    });
  } catch (err) {
    console.error('Error in getSubscriptionById:', err);
    next(err);
  }
};


export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    let workflowRunId = null;

    try {
      const baseUrl = process.env.SERVER_URL || "http://localhost:3000";
      const result = await workflowClient.trigger({
        url: `${baseUrl}/api/v1/workflows/subscription/reminder`,
        body: {
          subscriptionId: subscription.id,
        },
        headers: {
          'content-type': 'application/json',
        },
        retries: 0,
      });
      workflowRunId = result.workflowRunId;
    } catch (workflowError) {
      console.error('Failed to trigger workflow:', workflowError.message);
    }

    return res.status(201).json({ success: true, data: { subscription, workflowRunId } });
  } catch (e) {
    return next(e);
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
