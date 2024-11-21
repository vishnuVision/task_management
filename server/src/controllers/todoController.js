import { Todo } from "../db/models/todoModels.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { sendResponse } from "../utils/sendResponse.js";

const createTodo = async (req,res,next) => {
    if(!req.admin)
        return next(new ErrorHandler("Please Login as admin!",404));

    const { title, description, status, priority, assignee} = req?.body;

    if(!title || !description || !status || !priority || !assignee)
        return next(new ErrorHandler("Text, description, status and priority are required",400));

    const todo = await Todo.create({ title, description, status, priority, owner:assignee });

    if(!todo)
        return next(new ErrorHandler("Todo not created, please try again",201));

    return sendResponse(res,200,"Todo created successfully",true,todo);
}

const deleteTodo = async (req,res,next) => {
    if(!req.admin)
        return next(new ErrorHandler("Please Login as admin!",404));

    const { id } = req?.params;

    if(!id)
        return next(new ErrorHandler("Todo id is required",400));

    const todo = await Todo.findByIdAndDelete(id);    

    if(!todo)   
        return next(new ErrorHandler("Todo not found",404));

    return sendResponse(res,200,"Todo deleted successfully",true,todo);
}

const updateTodo = async (req,res,next) => {
    if(!req.admin)
        return next(new ErrorHandler("Please Login as admin!",404));

    const { title, description, status, priority, assignee } = req?.body;
    const { id } = req?.params;

    if(!title || !description || !status || !priority || !assignee)
        return next(new ErrorHandler("Text, description, status and priority are required",400));

    if(!id)
        return next(new ErrorHandler("Todo id is required",400));

    const todo = await Todo.findByIdAndUpdate(id,{ title, description, status, priority, owner:assignee });

    if(!todo)   
        return next(new ErrorHandler("Todo not found",404));

    return sendResponse(res,200,"Todo updated successfully",true,todo);
}

const getAllTodo = async (req,res,next) => {
    const {page} = req.params;
    const limit=5;
    const skip = (page-1)*limit; 

    if(page < 1)
        return next(new ErrorHandler("Invalid Page Number",400));

    if(!req.user && !req.admin)
        return next(new ErrorHandler("Please Login!",404));

    let owner = "";

    if(req.user)
    {
        owner = req.user._id;
    }
    else
    {
        owner = req.admin._id;
    }

    const completedtodos = await Todo.find({owner,status:"COMPLETED"}).skip(skip).limit(limit);
    const incompletedtodos = await Todo.find({owner,status:"INCOMPLETED"}).skip(skip).limit(limit);
    const inprogresstodos = await Todo.find({owner,status:"INPROGRESS"}).skip(skip).limit(limit);
    
     
    if(!completedtodos && !incompletedtodos && !inprogresstodos)   
        return next(new ErrorHandler("Todos Not Available",404));

    return sendResponse(res,200,"Todo Fetched Successfully",true,[...completedtodos,...incompletedtodos,...inprogresstodos]);
}

const getUserTodos = async (req,res,next) => {
    const {_id,page} = req.params;
    const limit=5;
    const skip = (page-1)*limit; 

    if(page < 1)
        return next(new ErrorHandler("Invalid Page Number",400));

    const completedtodos = await Todo.find({owner:_id,status:"COMPLETED"}).skip(skip).limit(limit);
    const incompletedtodos = await Todo.find({owner:_id,status:"INCOMPLETED"}).skip(skip).limit(limit);
    const inprogresstodos = await Todo.find({owner:_id,status:"INPROGRESS"}).skip(skip).limit(limit);
    
     
    if(!completedtodos && !incompletedtodos && !inprogresstodos)   
        return next(new ErrorHandler("Todos Not Available",404));

    return sendResponse(res,200,"Todo Fetched Successfully",true,[...completedtodos,...incompletedtodos,...inprogresstodos]);
}

export {
    createTodo,
    deleteTodo,
    updateTodo,
    getAllTodo,
    getUserTodos
}
