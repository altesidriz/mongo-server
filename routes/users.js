import express from "express";
import { test } from "../controlers/user.js";

const router = express.Router();

router.get("/test", test);

export default router;