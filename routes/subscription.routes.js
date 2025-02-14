import { Router } from "express";
import authorize from "../middleware/auth.middleware.js";
import { createSubscription, getUserSubscriptions, getSubscriptionById, updateSubscriptions, cancelSubscriptions, deleteSubscription, getUpcomingRenewals } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get('/', (req,res) => {
    res.send('Fetch all subscription');
});
subscriptionRouter.get('/user/:id',authorize,getSubscriptionById);
subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id',authorize,updateSubscriptions);
subscriptionRouter.delete('/:id',authorize, deleteSubscription);
subscriptionRouter.get('/user/:id', authorize,getUserSubscriptions);

subscriptionRouter.put('/:id/cancel',authorize,cancelSubscriptions);

subscriptionRouter.get('/upcoming-renewals',authorize,getUpcomingRenewals )
export default subscriptionRouter;
