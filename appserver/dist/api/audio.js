const env = require("../env")()
const { ExpressPeerServer } = require('peer')

module.exports = (app, server) => {
  console.log("Audio Loaded")
  const peerServer = ExpressPeerServer(server, {
    debug: true,
    path: '/myapp'
  })

  let allClients = [];

  peerServer.on("connection", client => {
    console.log("Peer client connected", client.token);
    allClients.push(client);
    client.send("Hello!")
  })
  app.use('/peerjs', peerServer)
}

