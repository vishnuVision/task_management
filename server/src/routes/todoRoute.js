import { Router } from "express";
import { createTodo, deleteTodo, getAllTodo, updateTodo, getUserTodos } from "../controllers/todoController.js";
import { createTodoValidation, deleteTodoValidation, getAllTodosValidation, updateTodoValidation, validationHandler } from "../validators/todoValidators.js";
import { authMiddleware,adminauthMiddleware } from "../middleware/auth.middleware.js";

const todoRouter = Router();


todoRouter.get("/getTodos/:page",authMiddleware,getAllTodo);
todoRouter.get("/getAllTodos/:_id/:page",authMiddleware,getAllTodosValidation(),validationHandler,getUserTodos);

todoRouter.use(adminauthMiddleware);
todoRouter.post("/createTodo",createTodoValidation(),validationHandler,createTodo);
todoRouter.delete("/deleteTodo/:id",deleteTodoValidation(),validationHandler,deleteTodo);
todoRouter.put("/updateTodo/:id",updateTodoValidation(),validationHandler,updateTodo);

export 
{
    todoRouter
}