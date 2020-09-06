/**
 * Simple Chatting Application with Node.js
 * Author: Oyamo Brian
 */

// < Dependencies >
const express = require('express');
const config = require('./config.json');
const socketIO = require('socket.io');
const http = require('http');
// </ Dependencies >

// < Initialisations >
const app = express();
const httpServer = http.createServer(app);
const roomSocket = socketIO(httpServer);
// </ Initialisations >

// < MiddleWares >
app.use(express.static('public'))
// </ Middlewares >

// HomePage
app.get('/',(request, response)=>{
    response.sendFile(__dirname + '/public/index.html')
})

roomSocket.on('connection',(socket)=>{
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
});

httpServer.listen(config.PORT, ()=>{
    console.log(`Server's Listening on *:${config.PORT}`)
})