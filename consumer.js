const amqp = require('amqplib');

async function receiveTasks(){
    let connection; 
    let channel; 
    try {
        connection = await amqp.connect("amqp://localhost");
        channel = await connection.createChannel();
        const queue = 'task_queue'

        await channel.assertQueue(queue, { durable: true }); // Ensure the queue exists and is durable
        channel.prefetch(1); // Limit the number of unacknowledged messages to 1


        console.log('Waiting for messages in %s', queue); // Log waiting message
        channel.consume(queue, async (msg) => { // Start consuming messages from the queue
            if (msg !== null) {
                try {
                    const task = msg.content.toString(); 
                    console.log(`Received: ${task}`); 
                    // Simulate processing time
                    await new Promise(resolve => setTimeout(resolve, 1000)); 
                    channel.ack(msg); 
                } catch (processingError) {
                    console.error('Error processing message:', processingError); 
                    
                }
            }
        });
        
    } catch (error) {
        console.error('Error receiving tasks:', error);
    }

}

receiveTasks(); 
