import { Todo } from "../db/models/todoModels.js";
import { User } from "../db/models/user.model.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { emitEvent } from "../utils/getMemberSocket.js";
import { sendResponse } from "../utils/sendResponse.js";

const createTodo = async (req, res, next) => {
    try {
        if (!req.admin)
            return next(new ErrorHandler("Please Login as admin!", 404));

        const { title, description, status, priority, assignee } = req?.body;

        if (!title || !description || !status || !priority || !assignee)
            return next(new ErrorHandler("Text, description, status and priority are required", 400));

        const todo = await Todo.create({ title, description, status, priority, owner: assignee });

        if (!todo)
            return next(new ErrorHandler("Todo not created, please try again", 201));

        const ownerData = await User.findById(todo.owner).select("-createdAt -updatedAt -__v -password -name -_id -email").lean();

        if(!ownerData)
            return next(new ErrorHandler("Owner not found",404));

        emitEvent(req , next , "NEW_NOTIFICATION" , {...todo._doc,owner:ownerData,message:"assign a New Task"} , todo.owner.filter((member)=>member.toString() !== req.admin._id.toString()));

        return sendResponse(res, 200, "Todo created successfully", true, todo);
    } catch (error) {
        return next(new ErrorHandler(error.message || "An unexpected error occurred", 404));
    }
}

const deleteTodo = async (req, res, next) => {
    try {
        if (!req.admin)
            return next(new ErrorHandler("Please Login as admin!", 404));

        const { id } = req?.params;

        if (!id)
            return next(new ErrorHandler("Todo id is required", 400));

        const todo = await Todo.findByIdAndDelete(id);

        if (!todo)
            return next(new ErrorHandler("Todo not found", 404));

        return sendResponse(res, 200, "Todo deleted successfully", true, todo);
    } catch (error) {
        return next(new ErrorHandler(error.message || "An unexpected error occurred", 404));
    }
}

const updateTodo = async (req, res, next) => {
    try {
        if (!req.admin)
            return next(new ErrorHandler("Please Login as admin!", 404));

        const { title, description, status, priority, assignee } = req?.body;
        const { id } = req?.params;

        if (!title || !description || !status || !priority || !assignee)
            return next(new ErrorHandler("Text, description, status and priority are required", 400));

        if (!id)
            return next(new ErrorHandler("Todo id is required", 400));

        const todo = await Todo.findByIdAndUpdate(id, { title, description, status, priority, owner: assignee });

        if (!todo)
            return next(new ErrorHandler("Todo not found", 404));

        if(todo.status !== "COMPLETED")
        {
            const todoNewData = await Todo.findById(todo._id).populate("owner","username avatar admin -_id").lean();
            emitEvent(req , next , "NEW_NOTIFICATION" , {...todoNewData,owner:req?.admin,message:"update your task as completed"} , todo.owner.filter((member)=>member.toString() !== req.admin._id.toString()));
        }

        return sendResponse(res, 200, "Todo updated successfully", true, todo);
    } catch (error) {
        return next(new ErrorHandler(error.message || "An unexpected error occurred", 404));
    }
}

const getAllTodo = async (req, res, next) => {
    try {
        const { page } = req.params;
        const limit = 5;
        const skip = (page - 1) * limit;

        if (page < 1)
            return next(new ErrorHandler("Invalid Page Number", 400));

        if (!req.user && !req.admin)
            return next(new ErrorHandler("Please Login!", 404));

        let owner = "";

        if (req.user) {
            owner = req.user._id;
        }
        else {
            owner = req.admin._id;
        }

        const completedtodos = await Todo.find({ owner, status: "COMPLETED" }).skip(skip).limit(limit);
        const incompletedtodos = await Todo.find({ owner, status: "INCOMPLETED" }).skip(skip).limit(limit);
        const inprogresstodos = await Todo.find({ owner, status: "INPROGRESS" }).skip(skip).limit(limit);


        if (!completedtodos && !incompletedtodos && !inprogresstodos)
            return next(new ErrorHandler("Todos Not Available", 404));

        return sendResponse(res, 200, "Todo Fetched Successfully", true, [...completedtodos, ...incompletedtodos, ...inprogresstodos]);
    } catch (error) {
        return next(new ErrorHandler(error.message || "An unexpected error occurred", 404));
    }
}

const getUserTodos = async (req, res, next) => {
    try {
        const { _id, page } = req.params;
        const limit = 5;
        const skip = (page - 1) * limit;

        if (page < 1)
            return next(new ErrorHandler("Invalid Page Number", 400));

        const completedtodos = await Todo.find({ owner: _id, status: "COMPLETED" }).skip(skip).limit(limit);
        const incompletedtodos = await Todo.find({ owner: _id, status: "INCOMPLETED" }).skip(skip).limit(limit);
        const inprogresstodos = await Todo.find({ owner: _id, status: "INPROGRESS" }).skip(skip).limit(limit);


        if (!completedtodos && !incompletedtodos && !inprogresstodos)
            return next(new ErrorHandler("Todos Not Available", 404));

        return sendResponse(res, 200, "Todo Fetched Successfully", true, [...completedtodos, ...incompletedtodos, ...inprogresstodos]);
    } catch (error) {
        return next(new ErrorHandler(error.message || "An unexpected error occurred", 404));
    }
}

export {
    createTodo,
    deleteTodo,
    updateTodo,
    getAllTodo,
    getUserTodos
}
