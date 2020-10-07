/**
 * Simple Chatting Application with Node.js
 * Author: Oyamo Brian
 */

// < Dependencies >
const express = require('express');
const config = require('./config.json');
const http = require('http');
const cookieparser = require('cookie-parser');
const mongoose = require('mongoose');
const logger = require('morgan');
const ChatEngine = require('./engine/chatengine')
const socketIO = require('socket.io');
// </ Dependencies >

// <Routers>
const home = require('./routes/home');
const login = require('./routes/login');
const signup = require('./routes/signup');
// </Routers>

// < Initialisations >
const app = express();
const httpServer = http.createServer(app);
const io = socketIO(httpServer);
// </ Initialisations >

// < MiddleWares >
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieparser());
app.use(logger('dev'));
app.set('view engine', 'ejs');
// </ Middlewares >


// <Database>
mongoose.Promise = global.Promise
mongoose.connect(config.MONGODB,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    (err)=>{
    if(err){
        console.log(err.message);
    }else{
        console.log("Connected to database successfully");
    }
});
// </Database>


// <Use the routes>
app.use('/',home(httpServer));
app.use('/login', login);
app.use('/register', signup);

const chatEngine = new ChatEngine();
chatEngine.socketIO = io;
chatEngine.startChat();

module.exports = httpServer;