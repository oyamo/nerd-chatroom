const jwt = require('jsonwebtoken')
const User = require('../models/user');

let auth = (req, res, next) => {
    let token = req.cookies.auth;
    User.findByToken(token)
        .then(user => {
            req.user = user;
            req.isLoggedin = user != null;
            next();
        })
        .catch(err => {
            req.user = null;
            req.isLoggedin = false;
            next();
        })
}

module.exports = auth