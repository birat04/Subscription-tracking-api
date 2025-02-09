import express from 'express';
import { PORT } from './config/env.js';

const app = express();

app.get('/', (req,res) => {
    res.send('Welcome to the subscription service');
});

app.listen(PORT, () => {
    console.log(`subscription tracker api is running on http://localhost:${PORT}`);
});

export default app;