import express from 'express';
import { PORT } from './config/env.js';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connectDB from './database/mongodb.js';

const app = express();
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);

app.get('/', (req,res) => {
    res.send('Welcome to the subscription service');
});

app.listen(PORT, async () => {
    console.log(`subscription tracker api is running on http://localhost:${PORT}`);
    await connectDB();
});

export default app;