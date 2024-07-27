const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("users");
const key = require("../keys");

module.exports = (req,res,next)=>{

    const {authorization} = req.headers

    if (!authorization){
        return res.status(401).json({error:"unauthorized : Try signing in again"})
    }  
    const token = authorization.replace("Bearer ","")

    jwt.verify(token,key.jwtSecret,(err,payload)=>{

        if(err){     console.log("Invalid token ", req.method, " ", req.url);
            return res.status(401).json({ error: "you must be logged in" });
          }
          const _id = payload
          User.findById(_id).then((user)=>{
              req.user = user
              next()
          })
    })

}

