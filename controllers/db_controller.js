const mongoose = require("mongoose");
const keys = require("../keys");
const { MongoClient } = require('mongodb');




const connectToDb = async () => {
    try {
        mongoose.connect(keys.mongoLocalURI, {

        });
    } catch (error) {
        console.log("db error : ", error.message);
    }
}


module.exports = { connectToDb };


