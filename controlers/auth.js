import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcrypt"
import { createError } from "../error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {

    try {
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({ ...req.body, password: hash });

        await newUser.save();
        res.status(200).send("User has been created!");

    } catch (err) {
        next(createError(404, "Invalid or duplicated user info!"))
    }
};

export const signin = async (req, res, next) => {
    try {
        const user = await User.findOne({ name: req.body.name });      //searching for user in db
        if (!user) return next(createError(404, "User was not found!"));     //handler if user not found

        const isCorrect = await bcrypt.compare(req.body.password, user.password)       // comapring hashed password
        if (!isCorrect) return next(createError(400, "Wrong credentials!")); ////handler for wrong pass

        const token = jwt.sign({ id: user._id }, process.env.JWT);
        const { password, ...others } = user._doc;
        res
            .cookie("access_token", token, {
                httpOnly: true
            })
            .status(200)
            .json(others)

    } catch (err) {
        next(err)
    }
};

export const googleAuth = async (req, res, next) => {
    try {
        const user = await User.findOne({email:req.body.email})
        if(user){
        const token = jwt.sign({ id: user._id }, process.env.JWT);
        res
            .cookie("access_token", token, {
                httpOnly: true
            })
            .status(200)
            .json(user._doc);
        }else{
            const newUser = new User ({
                ...req.body,
                fromGoogle: true
            })
            const savedUser = await newUser.save()
            const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
        res
            .cookie("access_token", token, {
                httpOnly: true
            })
            .status(200)
            .json(savedUser._doc)
        }
    } catch (err) {
        next(err)
    }
};