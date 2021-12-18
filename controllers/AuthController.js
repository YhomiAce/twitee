require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const uniqueString = require("unique-string");
const generateUsername = require('generate-username-from-email')

const sequelize = require("../database/PostgresDb");
const User = require("../models/User");
const { sendActivationEmail } = require("../services/EmailService/email_service");
const { capitalizeFirstLetter } = require("../helpers/helper")

exports.register = async (req, res, next) =>{
    sequelize.transaction(async t =>{
        try {
            const { email, password} = req.body;
            const errors = [];
            // Fetch the user using the email
            const user = await User.findOne({where: {email}, attributes:["id"]});
            
            // check if the user exists
            if(user){
                errors.push({ message: "This User already exist on our Database" });
                return res.status(400).send({
                    status: false,
                    errors
                });
            }

            // hash password
            const hashPwd = bcrypt.hashSync(password, 10);

            //generate unique string for email verification
            const email_token = uniqueString();

            // Generate username from the email address then capitalize the first letter
            var name = capitalizeFirstLetter(generateUsername(email))

            // Data to be saved in the database
            const request = {
                name,
                email,
                password: hashPwd,
                email_token
            }

            // save the user details in the database
            await User.create(request, {transaction: t});

            //send activation email notification
            await sendActivationEmail({name, email, email_token});
            return res.status(200).send({ 
                success: true, 
                message: "Registration successful, check your email for activation link"
            });
        } catch (error) {
            t.rollback();
            return next(error);
        }
    })
}

exports.login = async(req, res, next)=>{
   
    sequelize.transaction(async t =>{
        try {
            const {email, password} = req.body
            const errors = [];
            const user = await User.findOne({where:{email}, attributes: {exclude: [ 
            "createdAt", 
            "updatedAt",
            "deletedAt"
        ]}});
            if(!user) {
                errors.push({ message: "User not found" });
                return res.status(400).send({
                    status: false,
                    errors
                })
            }else{
                if (user.isActivated !== true) {
                    errors.push({ message: "Account not activated: Check your email for activation link" });
                    return res.status(400).send({
                        status: false,
                        errors
                    });
                }else{
                    const compare = bcrypt.compareSync(password, user.password);
                    if (!compare) {
                        errors.push({ message: "Invalid Credentials" });
                        return res.status(400).send({
                            status: false,
                            message: "Invalid Credentials"
                        })
                    }else{
                        const payload = {
                            user: {
                                id: user.id,
                            },
                            };
                        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: 36000});
                        return res.status(200).send({
                            status: true,
                            token, 
                            user
                        })
                    }
                }
            }
        } catch (error) {
            t.rollback();
            return next(error);
        }
    })
}

exports.checkAuth = async(req, res, next)=>{
    try {
        const id = req.user.id
        const user = await User.findOne({where:{id},
            attributes: {exclude: [ 
                "createdAt", 
                "updatedAt",
                "deletedAt"
            ]
        }})
        return res.status(200).send({
            status:true,
            user
        })
    } catch (error) {
        
        return res.status(500).send({
            status: false,
            message: "Server Error: "+error
        })
    }
}

exports.verifyemail = async(req, res, next)=>{
    try {
        const { email, token} = req.query;
        const user = await User.findOne({ where:{ email, email_token: token} });
        if (!user) {
            return res.status(400).send({
                success: false,
                message: "Invalid User"
            })
        }
        await User.update({ isActivated: true}, {where: { email}});
        return res.status(200).send({
            success: true,
            message: "User updated successfully"
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Server Error: "+error.message
        })
    }
}