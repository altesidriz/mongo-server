import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"

const app = express();
dotenv.config()

const connect = () => {
    mongoose.connect(process.env.MONGO).then(()=> {
        console.log("connected to db")
    }).catch(err=>{throw err})
}

app.listen(2426, ()=>{
    connect()
    console.log("Connected to Server")
})