
const keys = require('../keys');
const mongoose = require("mongoose");
const User = mongoose.model("users")
const Message = mongoose.model("messages")
const PendingMessage = mongoose.model("pendingMessages")


const sendMessage = (req, res) => {
    const file = req.file
    const serverIp = req.serverIp

    try {
        const { id, senderId, receiverId, message, messageType } = req.body
        if (file != undefined) {
            filePath = `${serverIp}:${keys.PORT}/images/chat/${file.filename}`
            console.log("file path : " , filePath)
        } else {
            filePath = null;
        }
        const messageData = new Message({
            _id: id,
            senderId: senderId,
            receiverId: receiverId,
            message: message,
            messageType: messageType,
            filePath: filePath
        })
        messageData.save().then((newMessage) => {
            const pendingMessageData = new PendingMessage({
                _id: id,
                receiverId: newMessage.receiverId,
            })

            pendingMessageData.save().then((newPendingMessage) => {
                const io = req.io
                User.findOne({ _id: newPendingMessage.receiverId }).then((user) => {
                    socketId = user.socketId
                    const data = {
                        id: id,
                        message: message,
                        senderId: senderId,
                        receiverId: receiverId,
                        messageType: messageType,
                        filePath: filePath,
                        createdAt: Date.now(),
                    };

                    io.to(socketId).emit("message", data);
                    console.log(req.url, " ", req.method, "", { message: data });

                    return res.json({ message: "Message sent" });
                })
            })

        })
    } catch (error) {
        console.log("send message error ", error);
        return res.status(500).json({ status: false, message: "something wrong -check sendMessage controller- " });
    }
}


const messageReceived = (req, res) => {
    try {
        const { id, senderId } = req.body;
        console.log(
            req.body
        )
        const receivedAt = Date.now();
        Message.findById(id).then((data) => {

            if (data) {
                data.receivedAt = receivedAt;
                data.save();
                PendingMessage.findByIdAndDelete(id).then((data) => {
                    if (data) {

                        const io = req.io;
                        User.findById(senderId).then((userData) => {
                            if (userData) {
                                const socketId = userData.socketId;
                                io.to(socketId).emit("messageReceived", {
                                    messageId: id,
                                    receivedAt: receivedAt,
                                });
                                console.log(req.url, " ", req.method, "", { message: "Success" });
                                res.send({ message: "Success" });
                            }
                            else {
                                console.log(req.url, " ", req.method, "", { message: "Error user not found" });
                                res.send({ message: "Error" });
                            }

                        })
                    }
                    else {
                        console.log(req.url, " ", req.method, "", { message: "Error pendingMessage not found" });
                        res.send({ message: "message Error -PendingMessage-" });
                    }
                })
            }
            else {
                console.log(req.url, " ", req.method, "", { message: "Message not found" });
                res.send({ message: "message Error -messageReceived-" });
            }
        }).catch((error) => {
            if (error) { console.log(error); res.send({ message: "message Error -messageReceived-" }); }
        })
    } catch (error) {
        if (error) { console.log(error); res.send({ message: "message Error -messageReceived-" }); }
    }

}



const messageOpened = (req, res) => {
    try {
        const { id, senderId } = req.body;

        const openedAt = Date.now();
        const io = req.io;

        User.findById(senderId).then((userData) => {
            const socketId = userData.socketId;

            Message.findByIdAndUpdate(id, { openedAt: openedAt }).then(() => {
                console.log(req.url, " ", req.method, "", { message: "Success" });
            });

            io.to(socketId).emit("messageOpened", {
                messageId: id,
                openedAt: openedAt,
            });


            return res.json({ message: "Success" });
        });
    } catch (e) {
        console.log("OpenedAt message error ", e);
        return res.status(500).json({ status: false, message: "something wrong  -messaageOpened-" });
    }
}


module.exports = { sendMessage, messageReceived, messageOpened }