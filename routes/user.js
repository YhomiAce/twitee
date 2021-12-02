const express = require("express");

const router = express.Router();
const AuthController = require("../controllers/AuthController");
const Auth = require("../middlewares/Auth")

const { 
    registerValidation, 
    validate, 
    loginValidation
} = require('../services/Validator/validator')

/** ************************************************************************************************
 USER REGISTRATION ROUTES Will come below prefix by /user
*************************************************************************************************** */
router.route("/user").get(Auth, AuthController.checkAuth);

router.route("/user/register").post(registerValidation(), validate, AuthController.register);

router.route("/user/login").post(loginValidation(), validate, AuthController.login);

router.route("/user/verifyemail").get(AuthController.verifyemail)


module.exports = router;
