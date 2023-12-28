import express from "express";
import { signup, signin, google } from "../controlers/auth.js";

const router = express.Router();

//CREATE A USER
router.post("/signup", signup)

// SIGN IN
router.post("/signin", signin)

//GOOGLE AUTH
router.post("/google", google)


export default router;