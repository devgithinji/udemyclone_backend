import express from "express"
import cors from "cors"
import csrf from "csurf"
import cookieParser from "cookie-parser"

const morgan = require('morgan')
require('dotenv').config()
import 'express-async-errors'

const csrfProtection = csrf({cookie: true})

//routers
import authRoutes from './routes/auth.js'
import instructorRoutes from "./routes/instructor";
import courseRoutes from "./routes/courses"
import mongoose from "mongoose";
import errorHandler from "./error/error-handler";
import notFound from "./middlewares/not-found";


//create express app
const app = express();

//db connection
mongoose.connect(process.env.DATABASE).then(() => console.log('db connected')).catch((err) => console.log('db connection error'))

//apply middlewares
app.use(cors())
app.use(express.json({limit: "5mb"}))
app.use(cookieParser())
app.use(morgan('dev'))

//route
app.use('/api/auth', authRoutes)
app.use('/api', instructorRoutes)
app.use('/api', courseRoutes)

//csrf
app.use(csrfProtection)

app.get('/api/csrf-token', (req, res) => {
    res.json({csrfToken: req.csrfToken()})
})

//not found
app.use(notFound)
//error handler
app.use(errorHandler)


//port
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})