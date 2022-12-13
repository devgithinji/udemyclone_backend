import {hashPassword, comparePassword} from "../utils/auth";
import User from "../model/user";
import jwt from 'jsonwebtoken'
import AWS from 'aws-sdk'
import {nanoid} from "nanoid";

require('dotenv').config()

const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVersion: process.env.AWS_API_VERSION
}

export const resetPassword = async (req, res) => {
    const {email, newPassword, code} = req.body;
    const hashedPassword = await hashPassword(newPassword);
    const user = User.findOneAndUpdate({
        email, passwordResetCode: code
    }, {password: hashedPassword, code: ''}).exec();
    if (user) return res.json({ok: true})
};


export const forgotPassword = async (req, res) => {
    const {email} = req.body;
    const shortCode = nanoid(6).toUpperCase();
    const user = await User.findOneAndUpdate({email}, {passwordResetCode: shortCode})
    if (!user) return res.status(400).send("User not found");

    //prepare email
    const params = {
        Source: process.env.EMAIL_FROM,
        Destination: {
            ToAddresses: [email]
        },
        ReplyToAddresses: [process.env.EMAIL_FROM],
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: `
                    <html>
                        <h1>Reset Password Link</h1>
                        <p>Use this code to reset your password</p>
                        <h2 style="color: red">${shortCode}</h2>
                        <i>udemyclone.com</i>
                    </html>
                    `
                }
            },
            Subject: {
                Charset: "UTF-8",
                Data: "Reset Password"
            }
        }
    }

    await SES.sendEmail(params).promise().then((data) => {
        console.log(data)
        return res.json({ok: true})
    }).catch((e) => {
        console.log(e)
        return res.json({error: true})
    });
};


const SES = new AWS.SES(awsConfig)

export const sendTestEmail = async (req, res) => {
    const params = {
        Source: process.env.EMAIL_FROM,
        Destination: {
            ToAddresses: [process.env.EMAIL_FROM]
        },
        ReplyToAddresses: [process.env.EMAIL_FROM],
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: `
                    <html>
                        <h1>Reset Password Link</h1>
                        <p>Please use the following link to reset your password</p>
                    </html>
                    `
                }
            },
            Subject: {
                Charset: "UTF-8",
                Data: "Password reset link"
            }
        }
    }

    await SES.sendEmail(params).promise().then((data) => {
        console.log(data)
        return res.json({ok: true})
    }).catch((e) => {
        console.log(e)
        return res.json({error: true})
    });

};


export const currentUser = async (req, res) => {
    await User.findById(req.user._id).select('-password').exec();
    return res.json({ok: true});
};


export const register = async (req, res) => {
    const {name, email, password} = req.body;
    if (!name) return res.status(400).send('name is required');

    if (!password || password.length < 6) return res.status(400).send("Password is required and should be min 6 characters long")

    let userExists = await User.findOne({email}).exec();
    if (userExists) return res.status(400).send("Email is taken")

    //hash password
    const hashedPassword = await hashPassword(password);

    //register
    const user = new User({
        name, email, password: hashedPassword
    })
    await user.save();

    return res.json({ok: 'true'})
}

export const login = async (req, res) => {
    const {email, password} = req.body;
    if (!email) return res.status(400).send('email is required');
    if (!password) return res.status(400).send('password is required');

    //check if db has user with that email
    const user = await User.findOne({email}).exec();
    if (!user) return res.status(400).send("no user found")

    const match = await comparePassword(password, user.password)

    if (!match) return res.status(400).send('invalid username or password')

    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});

    //return user and token to client
    user.password = undefined;
    //send token and cookie
    res.cookie("token", token, {
        httpOnly: true,
        // secure: true //ony works in https
    })

    //send user as json response
    res.json(user);

}


export const logout = (req, res) => {
    res.clearCookie("token");
    return res.json({message: 'logout success'})
};

