import { Subtodo } from "../db/models/subTask.model.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { sendResponse } from "../utils/sendResponse.js";

const createSubTodo = async (req,res,next) => {
    if(!req.admin)
        return next(new ErrorHandler("Please Login as admin!",404));

    const { title, description, status, assignee, todo} = req?.body;

    if(!title || !description || !status || !todo || !assignee)
        return next(new ErrorHandler("Text, description, status and priority are required",400));

    const createdTodo = await Subtodo.create({ title, description, status, owner:assignee, todo});

    if(!createdTodo)
        return next(new ErrorHandler("Todo not created, please try again",201));

    return sendResponse(res,200,"Todo created successfully",true,createdTodo);
}

const deleteSubTodo = async (req,res,next) => {
    if(!req.admin)
        return next(new ErrorHandler("Please Login as admin!",404));

    const { id } = req?.params;

    if(!id)
        return next(new ErrorHandler("Todo id is required",400));

    const todo = await Subtodo.findByIdAndDelete(id);    

    if(!todo)   
        return next(new ErrorHandler("Todo not found",404));

    return sendResponse(res,200,"Todo deleted successfully",true,todo);
}

const updateSubTodo = async (req,res,next) => {
    if(!req.admin)
        return next(new ErrorHandler("Please Login as admin!",404));

    const { title, description, status, assignee } = req?.body;
    const { id } = req?.params;

    if(!title || !description || !status || !assignee)
        return next(new ErrorHandler("Text, description, status and priority are required",400));

    if(!id)
        return next(new ErrorHandler("Todo id is required",400));

    const todo = await Subtodo.findByIdAndUpdate(id,{ title, description, status, owner:assignee });

    if(!todo)   
        return next(new ErrorHandler("Todo not found",404));

    return sendResponse(res,200,"Todo updated successfully",true,todo);
}

const getAllSubTodo = async (req,res,next) => {
    if(!req.admin && !req.user)
        return next(new ErrorHandler("Please Login!",404));

    const { todo } = req?.params;

    if(!todo)   
        return next(new ErrorHandler("Todo id is required",400));

    const todos = await Subtodo.find({todo}).populate("owner","avatar username admin");

    if(!todos)       
        return next(new ErrorHandler("Todos Not Available",404));

    return sendResponse(res,200,"Todo Fetched Successfully",true,todos);
}

export {
    createSubTodo,
    deleteSubTodo,
    updateSubTodo,
    getAllSubTodo
}