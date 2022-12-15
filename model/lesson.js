import mongoose from "mongoose";

const {Schema} = mongoose

const lessonSchema = new mongoose.Schema({
    title: {
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
    content: {
        type: {},
        minLength: 200
    },
    video_link: {},
    free_preview: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

export default lessonSchema;