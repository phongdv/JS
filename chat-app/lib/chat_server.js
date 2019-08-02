var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nicksName = {};
var namesUsed = [];
var currentRoom = {};


exports.listen = function(server) {
    io = socketio.listen(server);
    io.set('log level', 1);
    io.sockets.on('connection', (socket) => {
        guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
        joinRoom(socket, 'Lobby');
        handleMessageBroadcasting(socket, nickNames);
        handleNameChangeAttempts(socket, nickNames, namesUsed);
        handleRoomJoining(socket);
        socket.on('rooms', function() {
            socket.emit('rooms', io.sockets.manager.rooms);
        });
        handleClientDisconnection(socket, nickNames, namesUsed);
    });
};

function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
    var name = 'Guest ' + guestNumber;
    nickNames[socket.id] = name;
    socket.emit('nameResult', {
        success: true,
        name: name
    });
    namesUsed.push(name);
    return guestNumber + 1;
}

function joinRoom(socket, room) {
    socket.join(room);
    currentRoom[socket.id] = room;
    socket.emit('joinResult', {
        room
    });
    socket.broadcast.to(room).emit('message', {
        text: nickName[socket.id] + ' has join ' + room

    });
    var userInRoom = io.sockets.clients(room);
    if (userInRoom.length > 1) {
        var userInRoomSummary = 'users currently in ' + room + ' : ';
        for (var index in userInRoom) {

            var userSocketId = userInRoom[index].id;
            console.log(userSocketId);
            if (index > 0) {
                usersInRoomSummary += ', ';
            }
            usersInRoomSummary += nickNames[userSocketId];
        }
    }
    usersInRoomSummary += '.';
    socket.emit('message', { text: usersInRoomSummary });

}