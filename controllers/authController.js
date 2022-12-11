import {hashPassword, comparePassword} from "../utils/auth";
import User from "../model/user";
import jwt from 'jsonwebtoken'

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

