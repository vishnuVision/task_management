import { ErrorHandler } from "../utils/ErrorHandler.js";
import { body, cookie , validationResult } from "express-validator";

const validationHandler = async (req,res,next) => {
    const errors = validationResult(req);
    let errorMessages = errors.array().map((error)=>error.msg).join(", ")

    if(errors.isEmpty())
        return next();
    else 
        return next(new ErrorHandler(errorMessages,400));
}

const registerValidator = () => [
    body("username").notEmpty().withMessage("UserName is required"),
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    body("admin").notEmpty().withMessage("Please select user or admin"),
]

const loginValidator = () => [    
    body("email").isEmail().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    body("admin").notEmpty().withMessage("Please select user or admin"),
]

const getAlluserValidator = () => [
    cookie("adminToken").exists().withMessage("Admin Token is required"),
]


export {
    validationHandler,
    registerValidator,
    loginValidator,
    getAlluserValidator,
}