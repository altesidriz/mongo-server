import express from "express";
import * as userService from "../controlers/user.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();
//update user
router.put("/:id", verifyToken, userService.update);

//delete user
router.delete("/:id", verifyToken, userService.deleteUser);

//get a user
router.get("/find/:id", userService.getUser);

//subscribe a user
router.put("/sub/:id", verifyToken, userService.subscribe);

//unsubscribe a user
router.put("/unsub/:id", verifyToken, userService.unsubscribe);

//like a video
router.put("/like/:videoId", verifyToken, userService.like);

//dislike a video
router.put("/dislike/:videoId", verifyToken, userService.dislike);


export default router;