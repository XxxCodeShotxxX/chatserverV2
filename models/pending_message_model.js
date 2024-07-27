const mongoose = require("mongoose");


const pendingMessageSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    receiverId: {
        type: String,
        required: true
    },



})


module.exports =   mongoose.model("pendingMessages", pendingMessageSchema);