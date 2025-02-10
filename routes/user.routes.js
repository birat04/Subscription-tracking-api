import { Router } from "express";

const userRouter = Router();

userRouter.get('/', (req,res) => {
    res.send('Fetch all users');
});
userRouter.get('/:id', (req,res) => {
    res.send('Fetch a user by id');
});
userRouter.post('/', (req,res) => {
    res.send('Create a new user');
});
userRouter.put('/:id', (req,res) => {
    res.send('Update a user by id');
});
userRouter.delete('/:id', (req,res) => {
    res.send('Delete a user by id');
});

export default userRouter;
