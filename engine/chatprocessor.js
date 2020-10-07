const socketIO = require('socket.io');

const _ = (socket, priveSocket)=>{
    console.log("Socket")
    socket.on('message',(message)=>{
        const time = new Date();
        message['time'] = time;
        roomSocket.sockets.emit("broadcast",message);
        console.log(message)
    })
    socket.on('disconnect', ()=>{
        // Broadcast or save last seen
    });
}