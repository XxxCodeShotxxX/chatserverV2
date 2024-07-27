
const keys = require('../keys');
const mongoose = require("mongoose");
const User = mongoose.model("users")
const Message = require("../models/message_model")
const PendingMessage = require("../models/pending_message_model")



// when User (dis)connect
const onUserConnect = (socket, io) => {
    updateSocketId(socket, io)
    checkPendingMessage(socket)
    console.log(socket.data.userName, " connected")
}
function updateSocketId(socket, io) {
    User.findByIdAndUpdate(socket.data.userId, {
        $set: {
            socketId: socket.id,
            Onlinestatus:
                true
        }
    }).then((data) => {
        io.emit("/user_status" + socket.data.userId, false)

    }).catch((error) => {
        if (error) return console.log(error);
    })
}

function checkPendingMessage(socket) {
    PendingMessage.find({ receiverId: socket.data.userId }).then((data) => {
        data.forEach((message) => {
            Message.findById(message._id).then((messageData) => {
                if (messageData == null) Message.findByIdAndDelete(message._id)
                else {
                    const msg = {
                        id: messageData._id,
                        message: messageData.message,
                        senderId: messageData.senderId,
                        receiverId: messageData.receiverId,
                        messageType: messageData.messageType,
                        filePath: messageData.filePath,
                        createdAt: Date.parse(messageData.createdAt),
                    };

                    socket.emit("message", msg);
                }
                PendingMessage.findByIdAndDelete(message._id)
                console.log(messageData.message, " pending sent !!");
            })
        })
    }).catch((error) => {
        if (error) return console.log(error);
    })
}
const disconnectUser = (socket, io) => {
    User
        .findByIdAndUpdate(socket.data.userId, {
            $set: {
                socketId: "",
                Onlinestatus: false
            }
        }).then((data) => {
            io.emit("/user_status" + socket.data.userId, false)
        }).catch((error) => {
            if (error) return console.log(error);
        })
}



// Requests
const getUsers = (req, res) => {
    User.find({ _id: { $ne: req.user._Id } }).then((data) => {
        const result = {
            createdAt: Date.now(),
            users: data
        }
        console.log(req.url, " ", req.method, " ", result);
        return res.json(result);
    }).catch((error) =>
        res.status(500).json({ error: "Internal Server Error -getUsers-" + error })
    );
}



const getUserStatus = (req, res) => {

    const id = req.params.id
    User.findOne({ _id: id }).select("-__v").then((userData) => {
        if (userData) {
            const result = {
                status: userData.Onlinestatus,
                lastSeen: userData.lastSeen,
                createdAt: Date.now()
            }
            console.log(req.url, " ", req.method, " ", result);
            res.send(result)
        }
        else {
            res.status(401).json({ error: "User not found" })
        }
    })

}
const updateUserStatus = (req, res) => {
    const { status } = req.body;
    const userId = req.user._id;
    console.log(userId)

    const io = req.io;

    let updateData = { Onlinestatus: status };

    if (status == "false")
        updateData = { Onlinestatus: false, lastSeen: Date.now() };

    User.findByIdAndUpdate(userId, {
        $set: updateData,
    }).then((data) => {
        if (data) {
            let eventString = "/user_status" + userId;



            io.emit(eventString, status);

            const resultData = {
                Onlinestatus: status,
                lastSeen: data.lastSeen,
                message: "Successfully updated",
            };
            console.log(req.url, " ", req.method, " ", resultData);

            return res.json(resultData);
        }
    }).catch((error) => {
        if (error) {
            console.log(req.url, " ", req.method, " ", error);
            return res.status(400).json({
                status: false,
                message: "unable to update",
            });
        }
    });
}
const userNameUpdate = (req, res) => {

    const newName = req.body.newName
    const userId = req.user._id
    console.log(userId)
    User.findByIdAndUpdate(userId, {
        $set: { userName: newName },
    }).then(
        (data) => {
            if (data) {
                const resultData = {
                    userName: newName,
                    message: "Successfully updated",
                };
                console.log(req.url, " ", req.method, " ", resultData);
                return res.json(resultData);
            }
            else {
                return res.status(400).json({
                    status: false,
                    message: "unable to update",
                });
            }

        }

    )













}
const getUserDetailsByPhoneNumber = (req, res) => {
    const phoneNumber = req.params.phoneNumber
    User.findOne({ phoneNumber: phoneNumber }).then((data) => {
        if (data != null) {
            let profilePicUrl;
            if (data.profilePic != undefined) profilePicUrl = req.serverIp + ':' + keys.PORT + data.profilePic;
            const result = {
                id: data._id,
                userName: data.userName,
                phoneNumber: data.phoneNumber,
                dialCode: data.dialCode,
                profilePic: profilePicUrl,
                bio: data.bio,
                createdAt: Date.now()
            }
            console.log(req.url, " ", req.method, " ", result);
            res.send(result)
        }
        else res.status(404).json({ error: "User not found" })
    }
    )
}
const getUserDetailsById = (req, res) => {
    const id = req.params.id
    User.findOne({ _id: id }).then((data) => {
        if (data != null) {
            let profilePicUrl;
            if (data.profilePic != undefined) profilePicUrl = req.serverIp + ':' + keys.PORT + "/images/" + data.profilePic;
            console.log("pfp : ", profilePicUrl)
            const result = {
                id: data._id,
                userName: data.userName,
                phoneNumber: data.phoneNumber,
                dialCode: data.dialCode,
                profilePic: profilePicUrl,
                bio: data.bio,
                socketId: data.socketId,
                createdAt: data.createdAt
            }
            console.log(req.url, " ", req.method, " ", result);
            res.send(result)
        }

        else res.status(404).json({ error: "User not found" })
    }
    )
}
const uploadProfileImage = (req, res) => {

    const file = req.file
    const serverIp = req.serverIp
    const userId = req.user._id
    const filename = file.filename
    if (file == undefined) {
        const result = {
            status: false,
            message: "file is missing",
        };

        console.log(req.url, " ", req.method, "", result);

        return res.status(404).json(result);
    }
    else {

        User.findByIdAndUpdate(
            userId,
            { $set: { profilePic: filename } },
            { new: true } // Return the updated document
        )
            .then((data) => {
                if (data) {
                    const result = {
                        status: true,
                        message: "Successfully updated",
                        ImageUrl: `${serverIp}:${keys.PORT}/images/${data.profilePic}`,
                    };
                    console.log(`${req.url} ${req.method}`, result);
                    return res.json(result);
                } else {
                    const error = { status: false, message: "User not found" };
                    console.log(`${req.url} ${req.method}`, error);
                    return res.status(404).json(error);
                }
            })
            .catch((error) => {
                console.log(`${req.url} ${req.method}`, error);
                return res.status(400).json({ status: false, message: "Unable to update" });
            });
    }
}












module.exports = {
    onUserConnect,
    disconnectUser,
    getUsers,
    getUserStatus,
    updateUserStatus,
    userNameUpdate,
    getUserDetailsByPhoneNumber,
    getUserDetailsById,
    uploadProfileImage,
}