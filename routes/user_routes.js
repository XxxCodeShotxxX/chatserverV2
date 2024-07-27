const router = require('express').Router();
const controller = require('../controllers/user_controller');
const auth = require('../middleware/api_authentification');

const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/images/");
    },
    filename: function (req, file, cb) {
        cb(null, "PLIMG" + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

//User details :
//user list
router.get("/getUsers", auth, controller.getUsers);
//get user details by id
router.get("/getUserDetailsById/:id", auth, controller.getUserDetailsById);
//get user details by phoneNumber
router.get("/getUserDetailsByPhoneNumber/:phoneNumber", auth, controller.getUserDetailsByPhoneNumber);

//User status :
//get user status
router.get("/getUserStatus/:id", auth, controller.getUserStatus);
//update user status
router.put("/updateUserStatus", auth, controller.updateUserStatus);
//User profile :
//update user name
router.put("/updateUserName", auth, controller.userNameUpdate);
//profile image upload
router.post(
    "/profileImage",
    auth,
    upload.single("image"),
    controller.uploadProfileImage
);
module.exports = router;