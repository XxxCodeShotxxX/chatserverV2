const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("../keys");




module.exports = (socket, next) => {
    const token = socket.handshake.headers.token
    if (!token) {
        return next(new Error("no token provided"));
    }
    jwt.verify(token.replace("Bearer ",""), keys.jwtSecret, (err, payload) => {
        if (err) {
            return next(new Error("invalid token"));
        }
        const _id = payload
        User.findById(_id).then((userData) => {
            console.log(  " FROM SOCKET MIDDLEWARE : " +userData)
            if (userData) {
                socket.data = { userId: userData._id, userName: userData.userName }
                return next()
            } else { return next(new Error("invalid token")) }



        })
    })
}