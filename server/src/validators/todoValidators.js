import { body, param, validationResult } from "express-validator";
import { ErrorHandler } from "../utils/ErrorHandler.js";

const validationHandler = (req,res,next) => {
    const errors = validationResult(req);
    let errorMessages = errors.array().map((error)=>error.msg).join(", ")

    if(errors.isEmpty())
        return next();
    else 
        return next(new ErrorHandler(errorMessages,400));
}

const createTodoValidation = () => [
    body("title").notEmpty().withMessage("Todo Title Required"),
    body("description").notEmpty().withMessage("Description Required"),
    body("status").notEmpty().withMessage("Status Required"),
    body("priority").notEmpty().withMessage("priority Required")
]

const deleteTodoValidation = () => [
    param("id").isMongoId().withMessage("Please Provide Todo ID"),
]

const updateTodoValidation = () => [
    param("id").isMongoId().withMessage("Please Provide Todo ID"),
    body("title").notEmpty().withMessage("Todo Title Required"),
    body("description").notEmpty().withMessage("Description Required"),
    body("status").notEmpty().withMessage("Status Required"),
    body("priority").notEmpty().withMessage("priority Required"),
]

const getAllTodosValidation = () => [
    param("_id").isMongoId().withMessage("Please Provide User ID"),
    param("page").isInt().withMessage("Please Provide Page Number")
]

export {
    validationHandler,
    createTodoValidation,
    deleteTodoValidation,
    updateTodoValidation,
    getAllTodosValidation
}