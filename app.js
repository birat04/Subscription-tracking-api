import express from 'express';


const app = express();

app.get('/', (req,res) => {
    res.send('Welcome to the subscription service');
});

app.listen(3000, () => {
    console.log('subscription tracker api is running on http://localhost:3000');
});

export default app;