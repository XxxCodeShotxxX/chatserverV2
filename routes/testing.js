const Message = require('../models/message_model');
const pendingMessage = require('../models/pending_message_model');
const user = require('../models/user_model');
const router = require('express').Router();
const jwt = require("jsonwebtoken");
const key = require("../keys");
const bcrypt = require("bcryptjs");
const Mongoose = require("mongoose");





router.get("/addUser/:id", (req, res,next) => {

  
    const id = req.params.id;
    const newUser = user({
     _id: id,
      userName: "userName"+id,
      phoneNumber: "065921452"+id,
      dialCode: "213",
    })
    newUser.save()
    next();
  } , (req, res) => {
    console.log("second function")
    res.send(req.body)
  })
router.get("/addMessage/:id", (req, res) => {
    id = req.params.id
    const newMessage = Message({
      _id: id,
      senderId: "SENDER"+id,
      receiverId: "RECIEVER"+id,
      message: "hello",
      messageType: "text",
    })
    newMessage.save().then((data) => {
      res.send(data);
    })
   
  })
router.get("/addPendingMessage/:id", (req, res) => {
    const id = req.params.id;
    const newPendingMessage = pendingMessage({
      _id : id,
      receiverId: "RECIEVER"+id,


        
    })
    newPendingMessage.save().then((data) => {
      res.send(data);
    })
  })





module.exports = router