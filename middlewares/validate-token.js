import expressJwt from "express-jwt";
require("dotenv").config()

export const requireSignin = expressJwt({
    getToken: req => req.cookies.token,
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"]
})