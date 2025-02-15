import express from 'express';
import cookieParser from 'cookie-parser';
import { PORT } from './config/env.js';

import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connectDB from './database/mongodb.js';
import errorMiddleware from './middleware/error.middleware.js';
import arcjetMiddleware from './middleware/arcjet.middleware.js'
import workflowRouter from './routes/workflow.routes.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(arcjetMiddleware);


app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflow', workflowRouter);

app.use(errorMiddleware);

app.get('/', (req,res) => {
    res.send('Welcome to the subscription service');
});

app.listen(PORT, async () => {
    console.log(`subscription tracker api is running on http://localhost:${PORT}`);
    await connectDB();
});

export default app;