import express from "express";
import { userLoginController, userRegisterController, logoutUser, getCurrentUser } from "../controllers/user.js";
const router=express.Router();

router.post("/register",userRegisterController);
router.post("/login",userLoginController);
router.post("/logout",logoutUser);
router.get("/me", getCurrentUser);
export default router;


