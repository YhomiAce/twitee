require("dotenv").config();

const sequelize = require("../config/database/connection");
const User = require("../models/User");
const Twit = require("../models/Twit");
const Comment = require("../models/Comment");
const Like = require("../models/Like");
const cloudinary = require("../helpers/cloudinary");

exports.fetchAllTwits = async (req, res, next) => {
    try {
        const twits = await Twit.findAll({
            order: [["createdAt", "DESC"]], include: [

                {
                    model: Comment,
                    as: "comments",
                    attributes: { exclude: ["updatedAt", "deletedAt", "twitId"] },
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: ["name"]
                        }
                    ]
                },
                {
                    model: Like,
                    as: "likes",
                    attributes: ["userId"]
                },
                {
                    model: User,
                    as: "owner",
                    attributes: ["name"]
                }
            ]
        });
        return res.status(200).send({
            status: true,
            data: twits
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.fetchSingleTwit = async (req, res, next) => {
    try {
        const twit = await Twit.findOne({
            where: { id: req.params.id }, order: [["createdAt", "DESC"]], include: [

                {
                    model: Comment,
                    as: "comments",
                    attributes: { exclude: ["updatedAt", "deletedAt", "twitId"] },
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: ["name"]
                        }
                    ]
                },
                {
                    model: Like,
                    as: "likes",
                    attributes: ["userId"]
                },
                {
                    model: User,
                    as: "owner",
                    attributes: ["name"]
                }
            ]
        });
        if (!twit) {
            return res.status(200).send({
                status: false,
                message: "Twit is not available"
            })
        }
        return res.status(200).send({
            status: true,
            data: twit
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Server Error: " + error
        })
    }
}

exports.createTwits = async (req, res, next) => {
    sequelize.transaction(async t => {
        try {
            const { twit } = req.body;
            const id = req.user.id;

            const request = {
                twit,
                user_id: id
            }
            const result = await Twit.create(request, { transaction: t });
            return res.status(200).send({
                status: true,
                message: "Twit created successfully",
                data: result
            })
        } catch (error) {
            t.rollback();
            return next(error);
        }
    })

}

exports.deleteTwits = async (req, res, next) => {
    sequelize.transaction(async t => {
        try {
            const user_id = req.user.id;

            const post = await Twit.findByPk(req.params.id);

            // Check post exist
            if (!post) {
                return res.status(404).send({
                    status: false,
                    msg: "Twit not found",
                });
            }
            // Check user
            if (post.user_id.toString() !== req.user.id) {
                return res.status(401).send({
                    status: false,
                    msg: "User not Authorised",
                });
            }

            await Twit.destroy({ where: { id: req.params.id }, transaction: t });
            return res.status(200).send({
                status: true,
                message: "Twit DeletedAt successfully"
            })

        } catch (error) {
            t.rollback();
            return next(error);
        }
    })
}

exports.likeAndUnlikeTwit = async (req, res, next) => {
    sequelize.transaction(async t => {
        try {
            const userId = req.user.id;
            const { twitId } = req.body;
            const like = await Like.findOne({ where: { userId, twitId }, attributes: ["id"] });
            if (like) {
                await like.destroy({ where: { id: like.id }, transaction: t });
                return res.status(200).send({
                    status: true,
                    message: "Twit Unliked"
                })
            } else {
                await Like.create({ userId, twitId }, { transaction: t });
                return res.status(200).send({
                    status: true,
                    message: "Twit Liked"
                })
            }
        } catch (error) {
            t.rollback();
            return next(error);
        }
    })
};

exports.createCommnet = async (req, res, next) => {
    sequelize.transaction(async t => {
        try {
            const { comment, twitId } = req.body;
            const id = req.user.id;

            const request = {
                comment,
                user_id: id,
                twitId
            }
            const result = await Comment.create(request, { transaction: t });
            return res.status(200).send({
                status: true,
                message: "Twit commented successfully",
                data: result
            })
        } catch (error) {
            t.rollback();
            return next(error);
        }
    })

}