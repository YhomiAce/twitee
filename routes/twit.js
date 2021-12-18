const express = require("express");

const router = express.Router();
const TwitController = require("../controllers/TwitController");
const Auth = require("../middlewares/Auth");

const { 
    twitValidation, 
    validate,
    commentValidation,
    likeValidation
} = require('../services/Validator/validator')

/** ************************************************************************************************
 TWITS ROUTES Will come below prefix by /twits
*************************************************************************************************** */
router.route("/twits")
    .get(TwitController.fetchAllTwits)
    .post(Auth, twitValidation(), validate, TwitController.createTwits);

router.route("/twits/:id")
    .get(TwitController.fetchSingleTwit)
    .delete(Auth, TwitController.deleteTwits);

router.route("/twits/comment")
    .post(Auth, commentValidation(), validate, TwitController.createCommnet);

router.route("/twits/like-unlike")
    .post(Auth, likeValidation(), validate, TwitController.likeAndUnlikeTwit);



module.exports = router;
