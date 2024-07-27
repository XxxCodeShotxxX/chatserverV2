
const keys = require('../keys');
const mongoose = require("mongoose");
const User = mongoose.model("users")
const jwt = require("jsonwebtoken");

const createUser = (req, res) => {
    const { userName, phoneNumber, dialCode } = req.body;
  
    let errorMap = {};
  
    if (!userName || !dialCode || !phoneNumber) {
      errorMap.error = "Please input all fields";
      if (!userName) errorMap.name = "userName is required";
      if (!dialCode) errorMap.about = "dial code is required";
      if (!phoneNumber) errorMap.phoneNumber = "phoneNumber is required";
      console.log(req.url, " ", req.method, "", errorMap);
      return res.status(422).json(errorMap);
    }
  
    User.findOne({ phoneNumber: phoneNumber })
      .select("-__v")
      .then((savedUser) => {
        if (savedUser) {
          const token = jwt.sign({ _id: savedUser._id }, keys.jwtSecret);
  
          const result = {
            message: "User is already exist",
            token,
            user: savedUser,
            createdAt:Date.now(),
          };
  
          console.log(req.url, " ", req.method, "", result);
  
          return res.json(result);
        }
  
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
             userName,
          phoneNumber,
          phoneWithDialCode: "+" + dialCode + phoneNumber,
          dialCode,
        });
  
        user.save().then((user) => {
          const token = jwt.sign({ _id: user._id }, keys.jwtSecret);
  
          const result = {
            message: "Created Successfully",
            token,
            user,
            createdAt: Date.now(),
          };
  
          console.log(req.url, " ", req.method, "", result);
  
          res.json(result);
        });
      });
  };
  

  const userRegistration = (req, res) => {
    const { phoneNumber, dialCode } = req.body;
  
    let errorMap = {};
  
    if (!phoneNumber || !dialCode) {
      errorMap.error = "Please input all fields";
  
      if (!phoneNumber) errorMap.phoneNumber = "phoneNumber is required";
      if (!dialCode) errorMap.dialCode = "dial code is required";
  
      console.log(req.url, " ", req.method, "", errorMap);
      return res.status(422).json(errorMap);
    } else {

  
      User.findOne({ phoneNumber: phoneNumber })
        .select("-__v")
        .then((savedUser) => {
          if (savedUser) {
            const token = jwt.sign({ _id: savedUser._id }, keys.jwtSecret);
  
            const result = {
              message: "User is already exist",
              token,
              user: savedUser,
              createdAt:Date.now(),
            };
  
            console.log(req.url, " ", req.method, "", result);
  
            return res.json(result);
          } else {
            const user = new User({
                        _id: new mongoose.Types.ObjectId(),
              userName: "testUser",
              phoneNumber: phoneNumber,
              dialCode:dialCode,
            });
  
            user.save().then((user) => {
              const token = jwt.sign({ _id: user._id },keys.jwtSecret);
  
              const result = {
                message: "Created Successfully",
                token,
                user,
                createdAt: Date.now(),
              };
  
              console.log(req.url, " ", req.method, "", result);
  
              res.json(result);
            });
          }
        });
    }
  };


const MyDetails = (req, res) => {
    let profilePic

    if (req.user.profilePic != undefined) profilePic = req.serverIp + ':' + keys.PORT + '/images/' + req.user.profilePic
    console.log(req.user.profilePic, " -- ", profilePic)

    const result = {
        id: req.user._id,
        userName: req.user.userName,
        phoneNumber: req.user.phoneNumber,
        onlineStatus: req.user.Onlinestatus,
        dialCode: req.user.dialCode,
        profilePic: profilePic ?? "",
        dialCode: req.user.dialCode,
        bio: req.user.bio,
        socketId: req.user.socketId,
        createdAt: req.user.createdAt,
    }
    console.log(req.url, " ", req.method, " ", result);
    res.send(result)
}


module.exports = {
    MyDetails
    ,createUser,userRegistration
    }