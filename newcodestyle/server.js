import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const PORT = 9090;
const connections = [];






server.listen(PORT, () => {
    console.log('Server is running');
});
io.sockets.on('connection', (socket) => {
    connections.push(socket);
    console.log(' %s sockets is connected', connections.length);

    socket.on('disconnect', () => {
        connections.splice(connections.indexOf(socket), 1);
        console.log(' %s sockets is connected', connections.length);
    });

    socket.on('sending message', (message) => {
        console.log('Message is received :', message);

        io.sockets.emit('new message', { message: message });
    });

    console.log(connections);
});





app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});