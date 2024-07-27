const mongoose = require("mongoose");



const messageSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
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
    },
    messageType: {
        type: String,
        required: true
    }       ,
    filePath : {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    receivedAt : {
        type: Date,
        required: false
    },
    openedAt : {
        type: Date,
        required: false
    }


    

})

module.exports =   mongoose.model("messages", messageSchema);