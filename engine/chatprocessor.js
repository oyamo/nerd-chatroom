const socketIO = require('socket.io');

module.exports =  (roomSocket)=>{
    roomSocket.on('connection',(socket)=> {
        console.log("Socket")
        socket.on('message', (message) => {
            message['time'] = new Date();
            roomSocket.sockets.emit("broadcast", message);
            console.log(message)
        })
        socket.on('disconnect', () => {
            // Broadcast or save last seen
        });
    });
}