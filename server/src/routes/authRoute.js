import { Router } from "express";
import { getAllUsers, getUser, login, logout, register } from "../controllers/auth.controller.js";
import { upload } from "../middleware/multer.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {loginValidator, registerValidator, validationHandler } from "../validators/validation.js";

const authRouter = Router();

authRouter.post("/register",upload.single("avatar"),registerValidator(),validationHandler,register);
authRouter.post("/login",loginValidator(),validationHandler,login);
authRouter.get("/getallusers",authMiddleware,getAllUsers);
authRouter.get("/getUser",authMiddleware,getUser);
authRouter.delete("/logout",authMiddleware,logout);

export {
    authRouter
}