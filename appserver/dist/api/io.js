const env = require("../env")()
//const ss = require('socket.io-stream')

module.exports = server => {
    const io = require('socket.io')(server, {
        credentials: true,
        origin: env.domain,
        cookie: false,
        secure:true
    });
    let host = null;
    io.on('connection', (socket) => {

        //Client Joins
        socket.on("clientjoin", (data) => {
            console.log("Player joined", data)
            // Join channels for player, team, and host.
            socket.join(data.userid)
            socket.join(data.gameid)

            socket.on("gamechat", data => {
                console.log("gamechat", data)
                io.to(data.gameid).emit("gamechat", data)
            })
            socket.on("gamestatus", data => {
                io.to(data.gameid).emit("gamestatus", data)
            })
            if (host) {
                socket.on("hostchat", data => {
                    console.log("hostchat", data)
                    io.to(host).emit("playerchat", data)
                })
            }
        })

        //Host joins
        socket.on("hostjoin", (data) => {
            console.log("Host joined", data)
            socket.join(data.userid)
            socket.join(data.gameid)
            /*
            socket.on("hostaudio", (hostaudio) => {
                var stream = ss.createStream(hostaudio);
                io.to(data.gameid).emit('audio-stream', stream);
            })
            */
            socket.on("gamechat", data => {
                console.log("gamechat", data)
                io.to(data.gameid).emit("gamechat", data)
            })
            socket.on("gamestatus", data => {
                io.to(data.gameid).emit("gamestatus", data)
            })
        })

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
}

