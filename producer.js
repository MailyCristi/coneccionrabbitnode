
const amqp = require('amqplib');

// Función para enviar un mensaje a RabbitMQ
async function sendMessageToRabbitMQ(message) {
    try {
        const connection = await amqp.connect('amqp://admin:123456789@10.10.166.227:8888'); // Cambia la URL si es necesario
        const channel = await connection.createChannel();
        const queue = 'my_queue';

        await channel.assertQueue(queue, { durable: true });

        // Enviar el mensaje en formato JSON
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        console.log(`Mensaje enviado: ${JSON.stringify(message)}`);

        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.error('Error enviando mensaje:', error);
    }
}

// Exportar la función para ser utilizada en otros archivos
module.exports = sendMessageToRabbitMQ;

