const router = require('express').Router();
const controller = require('../controllers/message_controller');
const auth = require('../middleware/api_authentification');



const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/images/chat/");
    },
    filename: function (req, file, cb) {
        cb(null, "CHATIMG" + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });


//send message
router.post("/sendMessage", auth,  upload.single("image"),controller.sendMessage);
//send image
// router.post("/sendImage", auth, controller.sendImage);

//message Received
router.put("/messageReceivedUpdate", auth, controller.messageReceived);

//message Opened
router.put("/messageOpenedUpdate", auth, controller.messageOpened);



module.exports = router;