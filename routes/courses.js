import express from "express";
import {
    uploadImage,
    removeImage,
    create,
    instructorCourses,
    getCourse
} from "../controllers/courseController";
import {requireSignin} from "../middlewares/validate-token";
import {isInstructor} from "../middlewares";

const router = express.Router();

//image
router.post('/course/upload-image', requireSignin, uploadImage)
router.post('/course/remove-image', requireSignin, removeImage)

//course
router.post('/course', requireSignin, isInstructor, create)
router.get('/instructor-courses', requireSignin, instructorCourses)
router.get('/course/:slug', requireSignin, getCourse)


export default router;