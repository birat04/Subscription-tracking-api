import { Router } from "express";
import authorize from "../middleware/auth.middleware.js";
import { getUser, getUsers } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:id', authorize,getUser);
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
