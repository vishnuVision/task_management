import { Router } from "express";
import { adminauthMiddleware, authMiddleware } from "../middleware/auth.middleware.js";
import { createSubTodo, deleteSubTodo, getAllSubTodo, updateSubTodo, getUserSubTodo } from "../controllers/subtask.controller.js";

const subTodoRouter = Router();

subTodoRouter.get("/subtodo/:todo",authMiddleware,getAllSubTodo);
subTodoRouter.get("/getUsersubtodo/:todo",authMiddleware,getUserSubTodo);
subTodoRouter.post("/createSubtodo",adminauthMiddleware,createSubTodo);
subTodoRouter.put("/updateSubtodo/:id",adminauthMiddleware,updateSubTodo);
subTodoRouter.delete("/deleteSubtodo/:id",adminauthMiddleware,deleteSubTodo);

export 
{
    subTodoRouter
}