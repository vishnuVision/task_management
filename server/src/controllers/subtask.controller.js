import { Subtodo } from "../db/models/subTask.model.js";
import { User } from "../db/models/user.model.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { emitEvent } from "../utils/getMemberSocket.js";
import { sendResponse } from "../utils/sendResponse.js";

const createSubTodo = async (req,res,next) => {
    try {
        if(!req.admin)
            return next(new ErrorHandler("Please Login as admin!",404));
    
        const { title, description, status, assignee, todo} = req?.body;
    
        if(!title || !description || !status || !todo || !assignee)
            return next(new ErrorHandler("Text, description, status and priority are required",400));
    
        const createdTodo = await Subtodo.create({ title, description, status, owner:assignee, todo});

        if(!createdTodo)
            return next(new ErrorHandler("Todo not created, please try again",201));

        const ownerData = await User.findById(createdTodo.owner).select("-createdAt -updatedAt -__v -password -name -_id -email").lean();

        if(!ownerData)
            return next(new ErrorHandler("Owner not found",404));

        emitEvent(req , next , "NEW_SUBTASK" , createdTodo , createdTodo.owner.filter((member)=>member.toString() !== req.admin._id.toString()));
        emitEvent(req , next , "NEW_NOTIFICATION" , {...createdTodo._doc,owner:ownerData,message:"assign a new SubTask"} , createdTodo.owner.filter((member)=>member.toString() !== req.admin._id.toString()));

        return sendResponse(res,200,"Todo created successfully",true,createdTodo);
    } catch (error) {
        return next(new ErrorHandler(error.message || "An unexpected error occurred",404));   
    }
}

const deleteSubTodo = async (req,res,next) => {
    try {
        if(!req.admin)
            return next(new ErrorHandler("Please Login as admin!",404));
    
        const { id } = req?.params;
    
        if(!id)
            return next(new ErrorHandler("Todo id is required",400));
    
        const todo = await Subtodo.findByIdAndDelete(id);    
    
        if(!todo)   
            return next(new ErrorHandler("Todo not found",404));
    
        return sendResponse(res,200,"Todo deleted successfully",true,todo);
    } catch (error) {
        return next(new ErrorHandler(error.message || "An unexpected error occurred",404));
    }
}

const updateSubTodo = async (req,res,next) => {
    try {
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
    } catch (error) {
        return next(new ErrorHandler(error.message || "An unexpected error occurred",404));
    }
}

const getAllSubTodo = async (req,res,next) => {
    try {
        if(!req.admin && !req.user)
            return next(new ErrorHandler("Please Login!",404));

        let owner;

        if(req.user)
        {
            owner = req.user._id;
        }
        else
        {
            owner = req.admin._id;
        }
    
        const { todo } = req?.params;
    
        if(!todo)   
            return next(new ErrorHandler("Todo id is required",400));
    
        const todos = await Subtodo.find({todo,owner}).populate("owner","avatar username admin");
    
        if(!todos)       
            return next(new ErrorHandler("Todos Not Available",404));
    
        return sendResponse(res,200,"Todo Fetched Successfully",true,todos);
    } catch (error) {
        return next(new ErrorHandler(error.message || "An unexpected error occurred",404));
    }
}

const getUserSubTodo = async (req,res,next) => {
    try {
        if(!req.admin && !req.user)
            return next(new ErrorHandler("Please Login!",404));
    
        const { todo } = req?.params;
    
        if(!todo)   
            return next(new ErrorHandler("Todo id is required",400));
    
        const todos = await Subtodo.find({todo}).populate("owner","avatar username admin");
    
        if(!todos)       
            return next(new ErrorHandler("Todos Not Available",404));
    
        return sendResponse(res,200,"Todo Fetched Successfully",true,todos);
    } catch (error) {
        return next(new ErrorHandler(error.message || "An unexpected error occurred",404));
    }
}

export {
    createSubTodo,
    deleteSubTodo,
    updateSubTodo,
    getAllSubTodo,
    getUserSubTodo
}