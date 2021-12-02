const express = require("express");

const router = express.Router();
const AuthController = require("../controllers/AuthController");

const { 
    registerValidation, 
    validate, 
    loginValidation
} = require('../services/Validator/validator')

/** ************************************************************************************************
 USER REGISTRATION ROUTES Will come below prefix by /user
*************************************************************************************************** */

router.route("/user/register").post(registerValidation(), validate, AuthController.register);


module.exports = router;
