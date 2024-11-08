// consumer.js amqp://admin:123456789@10.10.166.227:8888
const amqp = require('amqplib');
const WebSocket = require('ws');
const PORT = 5001;

// Crear el servidor WebSocket
const wss = new WebSocket.Server({ port: PORT }, () => {
    console.log(`Servidor WebSocket corriendo en ws://localhost:${PORT}`);
});

// Función para conectarse a RabbitMQ y consumir mensajes
async function consumer() {
    try {
        const connection = await amqp.connect('amqp://admin:123456789@10.10.166.227:8888'); // Cambia la URL si es necesario
        const channel = await connection.createChannel();
        const queue = 'my_queue';

        await channel.assertQueue(queue, { durable: true });

        // Consumir mensajes en RabbitMQ
        channel.consume(queue, (message) => {
            if (message) {
                console.log("Mensaje recibido:", message.content.toString());

                // Enviar el mensaje a todos los clientes WebSocket conectados
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(message.content.toString());
                    }
                });

                // Confirmar el mensaje
                channel.ack(message);
            }
        }, { noAck: false });
    } catch (error) {
        console.error('Error al consumir mensajes de RabbitMQ:', error);
    }
}

// Iniciar la conexión y el consumo de mensajes
consumer();