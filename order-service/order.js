const amqp = require("amqplib");
const { model } = require("mongoose");

async function sendOrder(order) {
    let connection;
    let channel;
    try {
        // Step 1: Establish a connection to RabbitMQ
        connection = await amqp.connect("amqp://localhost");
        
        // Step 2: Create a channel
        channel = await connection.createChannel();
        
        // Step 3: Assert the queue (create it if it doesn't exist)
        const queue = 'order_queue';
        await channel.assertQueue(queue, { durable: true });

        // Step 4: Send the order to the queue
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(order)), { persistent: true });
        console.log(`Order sent: ${JSON.stringify(order)}`);

    } catch (error) {
        // Step 5: Handle errors
        console.error('Error sending order:', error);
    } finally {
        // Step 6: Close the channel and connection
        if (channel) {
            await channel.close();
        }
        if (connection) {
            await connection.close();
        }
    }
}

module.exports = {
    sendOrder,
}