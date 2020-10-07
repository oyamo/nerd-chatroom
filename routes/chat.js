const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user');
const socketIO = require('socket.io');
const htmpath = require('./getpath');
const he = require('he');
/***
 *
 */
router.get('/',auth, async (req, res) => {
    //Client must send a jwt cookie in the header
    if(req.isLoggedin){
        // Escape HTM tags
        const username = he.encode(req.params.id || '');
        const chatWith = await User.findOne({username: username}).exec();

        if(chatWith == null){
            return res.status(404)
                .send(`<br><br><center><h1>SmallTalk User @${username} Not found</h1></center>`)
        }

        res.render('chatscreen', {user: req.user, chatWith: chatWith});

    }else{

        res.sendFile(htmpath('homepage.html'));
    }
});

module.exports = (httpServer) =>{

    return router;
}