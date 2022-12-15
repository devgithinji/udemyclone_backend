import mongoose from "mongoose";
import lessonSchema from "./lesson";

const {ObjectId} = mongoose.Schema

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minLength: 3,
        maxLength: 320,
        required: true
    },
    slug: {
        type: String,
        lowercase: true
    },
    description: {
        type: {},
        minLength: 200,
        required: true
    },
    price: {
        type: Number,
        default: 9.99
    },
    image: {},
    category: String,
    published: {
        type: Boolean,
        default: false
    },
    paid: {
        type: Boolean,
        default: false
    },
    instructor: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    lessons: [lessonSchema]
}, {timestamps: true})

export default mongoose.model('Course', courseSchema)