const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    senderId: {
        type: String,
        required: true
    },
    receiverId: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    chatDate: {
        type: Date,
        required: true
    },
    hasBeenRead: {
        type: Boolean
    }
},{
    createIndex: true
});


const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;

