import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
 
const app = express()
//middleware app.use  cors
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// data aata hai
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import

import userRouter from './routes/user.routes.js'


// routes declaration

app.use("/api/v1/users",userRouter )

// http://localhost8000/api/v1/users/register 
export { app } 