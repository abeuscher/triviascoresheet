module.exports = server => {
    const io = require('socket.io')(server, {
        credentials: true,
        origin: 'http://64.225.118.246',
        cookie: false
    });
    let host = null;
    let runningGames = [{
        host:null,
        game:null
    }]
    io.on('connection', (socket) => {

        //Client Joins
        socket.on("clientjoin", (data)=>{
            console.log("Client joined",data)
            // Join channels for player, team, and host.
            socket.join(data.userid)
            socket.join(data.gameid)

            socket.on("gamechat",data=>{
                console.log("gamechat",data)
                io.to(data.gameid).emit("gamechat",data)
            })     
            socket.on("gamestatus",data=>{
                io.to(data.gameid).emit("gamestatus",data)
            })
            if (host) {
                socket.on("hostchat",data=>{
                    console.log("hostchat",data)
                    io.to(host).emit("playerchat",data)
                })                
            }
        })

        //Host joins
        socket.on("hostjoin", (data)=>{
            socket.join(data.gameid)

            socket.on("gamechat",data=>{
                console.log("gamechat",data)
                io.to(data.gameid).emit("gamechat",data)
            })  
            socket.on("gamestatus",data=>{
                io.to(data.gameid).emit("gamestatus",data)
            })
        })
    
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
}

