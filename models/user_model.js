const mongoose = require("mongoose");




const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: false
    },
    phoneNumber: {
        type: String,
        required: true
    },
    dialCode: {
        type: String,
        required: true
    },
    lastSeen: {
        type: Date,
        default: Date.now
    },
    Onlinestatus: {
        type: Boolean,
        default: false
    },
    profilePic: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        default: null
    },

    createdAt: {
        type: Date,
        default: Date.now
    }, 
    socketId: {
    type: String,
    default: "",
    required: false,
  },
}

);



 module.exports =   mongoose.model("users", userSchema);