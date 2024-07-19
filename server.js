const express = require('express');
const app = express();
const { v4: uuidV4 } = require('uuid');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});



app.set('view engine', 'ejs');
app.use(express.static('public'))
//app.use(express.json());
//app.use(express.urlencoded());
app.use('/peerjs', peerServer);

app.get("/", (req, res) => {
    res.render('lobby', { Id: uuidV4()});
});

app.get("/:room", (req, res) => {
    res.render('room', { 
        roomId: req.params.room,
        name: req.query.name
    });
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);

        socket.on('messageContent', (message) => {
            //send message to the same room
            io.to(roomId).emit('createMessage', message)
        }); 
    })
})

server.listen(process.env.PORT || 3000);