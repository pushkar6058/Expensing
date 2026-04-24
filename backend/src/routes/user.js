import express from "express";
import { userLoginController, userRegisterController } from "../controllers/user.js";
const router=express.Router();

// user register

router.post("/auth/register",userRegisterController);
// user login

router.post("/auth/login",userLoginController);
export default router;


