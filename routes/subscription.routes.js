import { Router } from "express";

const subscriptionRouter = Router();

subscriptionRouter.get('/', (req,res) => {
    res.send('Fetch all subscription');
});
subscriptionRouter.get('/:id', (req,res) => {
    res.send('Fetch a subscription by id');
});
subscriptionRouter.post('/', (req,res) => {
    res.send('Create a new subscription');
});
subscriptionRouter.put('/:id', (req,res) => {
    res.send('Update a subscription by id');
});
subscriptionRouter.delete('/:id', (req,res) => {
    res.send('Delete a subscription by id');
});
subscriptionRouter.get('/user/:id', (req,res) => {
    res.send('Fetch all subscription by user id');
});
subscriptionRouter.put('/:id/cancel', (req,res) => {
    res.send('Cancel a subscription by id');
});
subscriptionRouter.get('/upcoming-renewals', (req,res) => {
    res.send('Fetch all upcoming renewals');
});

export default subscriptionRouter;
