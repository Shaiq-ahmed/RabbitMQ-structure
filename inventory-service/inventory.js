const amqp = require('amqplib');

async function receiveOrders() {
    let connection;
    let channel;
    try {
        connection = await amqp.connect("amqp://localhost");
        channel = await connection.createChannel();
        const orderQueue = 'order_queue';
        const notificationQueue = 'notification_queue';

        await channel.assertQueue(orderQueue, { durable: true });
        await channel.assertQueue(notificationQueue, { durable: true });
        channel.prefetch(1); // Limit the number of unacknowledged messages to 1

        console.log('Waiting for orders in %s', orderQueue);
        channel.consume(orderQueue, async (msg) => {
            if (msg !== null) {
                const order = JSON.parse(msg.content.toString());
                console.log(`Processing order: ${JSON.stringify(order)}`);
                
                // Simulate inventory update
                await new Promise(resolve => setTimeout(resolve, 1000));
                console.log(`Inventory updated for order: ${order._id}`);

                // Send notification after inventory update
                const notification = { orderId: order.id, message: "Your order has been processed." };
                channel.sendToQueue(notificationQueue, Buffer.from(JSON.stringify(notification)), { persistent: true });
                console.log("order---------",order)
                console.log(`Notification sent for order: ${order._id}`);

                channel.ack(msg); // Acknowledge the message
            }
        });
    } catch (error) {
        console.error('Error receiving orders:', error);
    }
}

receiveOrders();