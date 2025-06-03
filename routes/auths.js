import express from "express";
import { signup, signin, googleAuth, logout } from "../controlers/authController.js";

const router = express.Router();

//CREATE A USER
router.post("/signup", signup)

// SIGN IN
router.post("/signin", signin)

// LOGOUT
router.post("/logout", logout);

//GOOGLE AUTH
router.post("/google", googleAuth)


export default router;