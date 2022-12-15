import User from "../model/user";
import querystring from "querystring";
import {nanoid} from "nanoid";

const stripe = require("stripe")(process.env.STRIPE_SECRET)

require('dotenv').config()

export const currentInstructor = async (req, res) => {
    let user = await User.findById(req.user._id).select("-password").exec();
    if (!user.role.includes('Instructor')) return res.sendStatus(403);
    return res.json({ok: true})
}


export const getAccountStatus = async (req, res) => {
    // find user from db
    const user = await User.findById(req.user._id).exec();
    if (!user) throw  new Error('user not found')
    const updatedUser = await User.findOneAndUpdate(user._id,
        {
            stripe_seller: 'seller_acc',
            $addToSet: {role: 'Instructor'}
        },
        {new: true}
    ).exec();
    updatedUser.password = undefined
    return res.json(updatedUser)
}

export const makeInstructor = async (req, res) => {
    // find user from db
    const user = await User.findById(req.user._id).exec();
    // if user does not have a stripe account we create a new one
    if (!user.stripe_account_id) {
        // const account = await stripe.accounts.create({type: "express"});
        const stripe_account_id = nanoid(7).toString();
        // user.stripe_account_id = account.id;
        user.stripe_account_id = stripe_account_id;
        await user.save();
    }
    //create account link based on account id (for frontend to complete onboarding)
    // let accountLink = await stripe.accountLinks.create({
    //     account: user.stripe_account_id,
    //     refresh_url: process.env.STRIPE_REDIRECT_URL,
    //     return_url: process.env.STRIPE_REDIRECT_URL,
    //     type: "account_onboarding"
    // })
    //prefill any info such as email then send url response to frontend
    // accountLink = Object.assign(accountLink, {
    //     "stripe_user[email]": user.email
    // })
    //send the account link as response to frontend
    // res.send(`${accountLink.url}?${querystring.stringify(accountLink)}`)
    res.send('http://localhost:3000/stripe/callback')
};
