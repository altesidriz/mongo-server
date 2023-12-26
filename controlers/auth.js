import mongoose from "mongoose";
import User from "../models/User.js";

export const sigup = async (req, res) => {
    try {
        const newUser = new User
    } catch (err) {
        //todo
    }
};

export const signin = (req, res) => {
    console.log('working');
};

export const google = (req, res) => {
    console.log('working');
};