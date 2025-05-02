import express from 'express';
import {
  getSubscriptionById,
  createSubscription,
  getUserSubscriptions,
  updateSubscriptions,
  cancelSubscriptions,
  deleteSubscription,
  getUpcomingRenewals
} from '../controllers/subscription.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import Subscription from '../models/subscription.js';

const router = express.Router();

// Debug route to list all subscriptions
router.get('/debug/all', async (req, res) => {
  try {
    const subscriptions = await Subscription.find({});
    res.status(200).json({
      status: 'success',
      count: subscriptions.length,
      data: subscriptions
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

// Existing routes
router.post('/workflow', getSubscriptionById);
router.post('/', protect, createSubscription);
router.get('/user/:id', protect, getUserSubscriptions);
router.patch('/:id', protect, updateSubscriptions);
router.delete('/:id', protect, deleteSubscription);
router.post('/:id/cancel', protect, cancelSubscriptions);
router.get('/upcoming', protect, getUpcomingRenewals);

export default router;
