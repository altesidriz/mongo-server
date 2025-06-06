import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import userRoutes from './routes/users.js';
import videoRoutes from './routes/videos.js';
import commentRoutes from './routes/comments.js';
import authRoutes from './routes/auths.js';

const app = express();
dotenv.config()

const connect = () => {
    mongoose.connect(process.env.MONGO_PLAY).then(() => {
        console.log("connected to db")
    }).catch((err) => {
        throw err;
    })
};

app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);


app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(status).json({
        success:false,
        status,
        message
    })
})

app.listen(1201, () => {
    connect()
    console.log("Connected to Server")
})