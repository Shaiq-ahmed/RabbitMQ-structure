const express = require('express');
const bodyParser = require('body-parser');
const { sendOrder } = require('./order'); // Import the sendOrder function

const app = express();
app.use(bodyParser.json());

app.post('/orders', async (req, res) => {
    const order = req.body; // Get order data from request body
    try {
        await sendOrder(order); // Send order to RabbitMQ
        res.status(201).send({ message: 'Order created successfully', order });
    } catch (error) {
        res.status(500).send({ message: 'Error creating order', error });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
});