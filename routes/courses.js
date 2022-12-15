import express from "express";
import {
    uploadImage,
    removeImage
} from "../controllers/courseController";
import {requireSignin} from "../middlewares/validate-token";

const router = express.Router();


router.post('/course/upload-image', requireSignin, uploadImage)
router.post('/course/remove-image', requireSignin, removeImage)


export default router;