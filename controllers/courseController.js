import {nanoid} from "nanoid";
import AWS from "aws-sdk"
import Course from "../model/course";
import slugify from "slugify";


const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVersion: process.env.AWS_API_VERSION
}

const s3 = new AWS.S3(awsConfig);

export const removeImage = async (req, res) => {
    const {image} = req.body;
    const params = {
        Bucket: image.Bucket,
        Key: image.Key
    }

    //send remove request
    s3.deleteObject(params, (err, data) => {
        if (err) {
            console.log(err)
            return res.sendStatus(400)
        }
        return res.send({ok: true})
    })
};


export const uploadImage = async (req, res) => {
    const {image} = req.body;
    if (!image) return res.status(400).send("No image");
    //const prepare the image
    const base64Data = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), "base64")

    const type = image.split(';')[0].split('/')[1]

    //image params
    const params = {
        Bucket: "udemyclonetest",
        Key: `${nanoid()}.${type}`,
        Body: base64Data,
        ACL: 'public-read',
        ContentEncoding: "base64",
        ContentType: `image/${type}`
    }

    //upload to s3
    s3.upload(params, (err, data) => {
        if (err) {
            console.log(err)
            return res.sendStatus(400)
        }
        res.send(data);
    })
};

export const create = async (req, res) => {
    const alreadyExists = await Course.findOne({
        slug: slugify(req.body.name.toLowerCase())
    })
    if (alreadyExists) return res.status(400).send("Title is already taken");
    const course = await new Course({
        slug: slugify(req.body.name),
        instructor: req.user._id,
        ...req.body
    }).save();

    res.json(course)
};

export const instructorCourses = async (req, res) => {
    const courses = await Course.find({instructor: req.user._id}).sort({createdAt: -1}).exec();
    res.json(courses)
}

export const getCourse = async (req, res) => {
    const course = await Course.findOne({slug: req.params.slug}).populate('instructor', '_id name').exec();
    res.json(course)
}
