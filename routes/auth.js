import express from "express";
import {
    login,
    register,
    logout,
    currentUser,
    sendTestEmail,
    forgotPassword,
    resetPassword
} from "../controllers/authController";
import {requireSignin} from "../middlewares/validate-token";

const router = express.Router();


router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.get('/current-user', requireSignin, currentUser)
router.get('/send-email', sendTestEmail)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

export default router;