const amqp = require("amqplib");

async function sendTask(task){
    let connection; 
    let channel; 
    try {
        connection = await amqp.connect("amqp://localhost");
        channel = await connection.createChannel();
        const queue = 'task_queue';

        await channel.assertQueue(queue, {durable: true});
        channel.sendToQueue(queue, Buffer.from(task), {persistent: true});

        console.log(`sent: ${task}`);
                
    } catch (error) {
        console.error('Error sending task:', error); 
    }finally{
        if(channel){
            await channel.close();
        }
        if(connection){
            await connection.close();
        }

    }
    

}

sendTask("Hello world!");