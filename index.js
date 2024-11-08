// index.js
const express = require('express');
const sendMessageToRabbitMQ = require('./producer');
const app = express();

// Configuración del puerto
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
  res.send('¡Hola, mundo! Esta es tu primera app en Express');
});

app.post('/send', async (req, res) => {
    const message = req.body;
    await sendMessageToRabbitMQ(message); // Enviar el mensaje a RabbitMQ usando el productor
    res.status(200).send({ status: 'Mensaje enviado a RabbitMQ' });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
