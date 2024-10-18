const amqp = require('amqplib');

async function receiveNotifications() {
    let connection;
    let channel;
    try {
        connection = await amqp.connect("amqp://localhost");
        channel = await connection.createChannel();
        const queue = 'notification_queue';

        await channel.assertQueue(queue, { durable: true });
        channel.prefetch(1); // Limit the number of unacknowledged messages to 1

        console.log('Waiting for notifications in %s', queue);
        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const notification = JSON.parse(msg.content.toString());
                console.log(`Sending notification: ${JSON.stringify(notification)}`);
                
                // Simulate sending notification
                await new Promise(resolve => setTimeout(resolve, 1000));
                console.log(`Notification sent for order: ${notification._id}`);
                
                channel.ack(msg); // Acknowledge the message
            }
        });
    } catch (error) {
        console.error('Error receiving notifications:', error);
    }
}

receiveNotifications();