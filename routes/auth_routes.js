const router = require('express').Router();
const controller = require('../controllers/auth_controller');
const auth = require('../middleware/api_authentification');




//create user

router.post("/createUser", controller.createUser);

//create user by phone number
router.post("/userRegistration", controller.userRegistration);


//get MyDetails
router.get("/MyDetails", auth, controller.MyDetails);








module.exports = router;