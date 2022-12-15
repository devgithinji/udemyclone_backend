import express from "express";
import {
    getAccountStatus,
    makeInstructor,
    currentInstructor
} from "../controllers/instructorController";
import {requireSignin} from "../middlewares/validate-token";

const router = express.Router();


router.post('/make-instructor', requireSignin, makeInstructor)
router.post('/get-account-status', requireSignin, getAccountStatus)
router.get('/current-instructor', requireSignin, currentInstructor)


export default router;