'use strict'
const User = require('../models/user');
const Chat = require('../models/chat')
/**
 * @author oyamoh-brian
 * @email oyamo.xyz@gmail.com
 * Super fast ChatEngine
 */
class ChatEngine{

    constructor() {
        this._chatSocketIO = null;
        this._innerSocket = null;
    }
    /**
     *
     * @param io
     */
    set socketIO(io){
        this._chatSocketIO = io
    }

    /**
     *
     * @param sock
     * @private
     */
    _setInnerSocket(sock){
        this._innerSocket = sock
    }

    /**
     *
     * @private
     */
    _listen(){
        this._innerSocket.on('message', async (message) => {
            const auth = message.auth || '';
            const receiver = message.receiver || '';
            try{
                const user = await User.findByToken(auth);
                if(user != null){
                    const sender = user.username;
                    const destination = await User.findOne({username: receiver});
                    if(destination != null){
                        const destinationUsername = destination.username;
                        this._sendMessage(sender, destinationUsername, message);
                    }
                }
            }catch (e) {
                console.log(e.message);
            }
        });
    }

    /**
     *
     * @param sender
     * @param destination
     * @param message
     * @private
     */
    _sendMessage(sender, destination, message){
        message['time'] = new Date();
        this._chatSocketIO.sockets.emit(destination, message);
        const chat = new Chat({
            senderId: sender,
            receiverId: destination,
            message: message['message'],
            chatDate: message['time']
        });
        //Do not log on production
        chat.save((err, doc)=>{
            console.log(err)
        })
    }
    /**
     * @public
     * Initialise chatEngine
     */
    startChat(){
        console.log("Starting engine");
        this._chatSocketIO.on('connection',(socket)=> {
            this._setInnerSocket(socket)
            this._listen();
        });
    }


}

module.exports = ChatEngine