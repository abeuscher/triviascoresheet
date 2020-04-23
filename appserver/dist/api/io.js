module.exports = server => {
    const io = require('socket.io')(server, {
        credentials: true,
        origin: 'http://teamtrivia.local',
        cookie: false
    });
    let host = null;
    io.on('connection', (socket) => {
        socket.emit("welcome", "Hey there");
        console.log('a user connected');
        socket.on('chat message', (msg) => {
            console.log('message: ' + msg);
        });
        socket.on("host message", (msg) => {
            console.log('message: ' + msg);
        });
        socket.on("playermessage", (msg) => {
            io.broadcast.emit("playermessage",msg)
        });
        socket.on("clientmsg", msg => {
            if (host) {
                host.emit("clientmsg", msg)
            }
        })
        socket.on("identify host", msg => {
            host = socket;
            host.on("gamecontrol", (msg) => {
                io.emit("gamecontrol", msg);
            });
            host.on("hostmessage", (msg) => {
                io.emit("hostmessage", msg);
            });
    
        })
    
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
}

