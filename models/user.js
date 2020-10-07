
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema
const secret = "a*)*@&%@%^&%%@%*&%*%*%((%@&#_)^&#)^-9-920IOJHx";

const userSchema = new Schema({
    fullNames: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    passWord: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    country:{
        type: String
    },

    state:{ // Or county
        type: String,
    },
    loginToken:{
        type: String
    },
    lastActive: {
        type: Date
    }

});

/**
 * Before saving the application
 */
userSchema.pre('save', function (next) {
    const user = this;

    if(user.isModified('passWord') || user.isNew){
        user.passWord = bcrypt.hashSync(user.passWord, 10);
        next();
    }else{
        next();
    }
});

//Login script
/***
 *
 * @param password
 * @returns {Promise<any>}
 */
userSchema.methods.attemptLogin = function (password) {
    const hash = this.passWord;
    return new Promise((resolve, reject) => {
        const match = bcrypt.compareSync(password, hash);
        resolve(match);
    })
};

/**
 *
 * @param token
 * @returns {Promise<any>}
 */
userSchema.statics.findByToken = function (token) {
    const user = this;
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decode) => {
            if (!err) {
                user.findOne({loginToken: token}, (err, user) => {
                    if (err == null) {
                        resolve(user);
                    } else {
                        reject(err);
                    }
                })
            } else {
                reject(err);
            }
        });
    })
};
/**
 *
 * @returns {Promise<any>}
 *
 */
userSchema.methods.generateToken = function () {
    const user = this;
    return new Promise((resolve, reject) => {
        // Generate Access Token
        const userId = user._id.toHexString();
        const buffer = new Buffer(userId);
        const userTK = buffer.toString('base64');
        user.loginToken = jwt.sign(
            {
                userToken: userTK
            },
            secret,
            {
                algorithm: 'HS256',
                expiresIn: 3600000
            }
        );

        // Generate Refresh token
        user.save((err, user) => {
            if (!err) {
                resolve(user);
            } else {
                reject(err);
            }
        })
    })
};
userSchema.methods.updateLastSeen = function () {
    const user = this;
    return new Promise(resolve => {
        user.lastActive = new Date();
        user.save((err, doc)=>{
            resolve([err, doc]);
        });
    });
};


module.exports =mongoose.model('User', userSchema);
