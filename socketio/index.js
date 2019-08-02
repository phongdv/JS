var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var bodyParser = require('body-parser')
app.use(bodyParser.json());
var connecteduser = 0;


io.on("connection", function(socket) {
    var tweet = { user: "nodesource", text: "Hello, world!" };
    connecteduser++;
    // to make things interesting, have it send every second

    socket.emit("tweet", tweet);
    socket.on("disconnect", function() {
        console.log("socket was disconnected");
        connecteduser--;
    });

    socket.on('chat message', (data) => {
        console.log(data);
        io.emit('test', data);

    });
    io.emit('userChange', connecteduser);




});
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});


app.post('/', function(req, res) {
    console.log(req.body);
    io.emit("test", req.body);
    res.send({ status: 'success' });
});

server.listen(8080, function() {
    console.log("Server have start aat port 8080");
});