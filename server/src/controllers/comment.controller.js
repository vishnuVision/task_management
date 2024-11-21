import { Comment } from "../db/models/comment.model.js";
import { Todo } from "../db/models/todoModels.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { emitEvent } from "../utils/getMemberSocket.js";
import { sendResponse } from "../utils/sendResponse.js";

const createComment = async (req,res,next) => {
    if(!req.user && !req.admin)
        return next(new ErrorHandler("Please Login!",404));

    const {text,todo} = req?.body;
    const {path} = req?.file;
    let owner;

    if(req.user)
    {
        owner = req.user._id;
    }
    else
    {
        owner = req.admin._id;
    }

    if(!text && !todo && !path && !owner) 
        return next(new ErrorHandler("All fields are required",400));

    const {url:image} = await uploadOnCloudinary(path);

    if(!image)
        return next(new ErrorHandler("Something wrong in Cloudinary",500));

    const comment = await Comment.create({text,image,owner,todo});

    if(!comment)
        return next(new ErrorHandler("Comment not created, please try again",201));

    const todoData = await Todo.findById(comment?.todo);

    if(!todoData)
        return next(new ErrorHandler("Comment todo not found, please try again",201));

    emitEvent(req , "NEW_COMMENT" , comment , todoData.owner);

    return sendResponse(res,200,"Comment created successfully",true,comment);
}

const deleteComment = async (req,res,next) => {
    if(!req.user && !req.admin)
        return next(new ErrorHandler("Please Login!",404));

    const {id} = req?.params;

    if(!id) 
        return next(new ErrorHandler("All fields are required",400));

    const comment = await Comment.findByIdAndDelete(id);

    if(!comment)
        return next(new ErrorHandler("Comment not deleted, please try again",201));

    return sendResponse(res,200,"Comment deleted successfully",true,comment);
}

const updateComment = async (req,res,next) => {
    if(!req.user && !req.admin)
        return next(new ErrorHandler("Please Login!",404));

    const {id} = req?.params;
    const {path} = req?.file;

    if(!path && !id) 
        return next(new ErrorHandler("All fields are required",400));

    const {url:image} = await uploadOnCloudinary(path);

    if(!image)
        return next(new ErrorHandler("Something wrong in Cloudinary",500));

    const comment = await Comment.findByIdAndUpdate(id,{image});

    if(!comment)
        return next(new ErrorHandler("Comment not updated, please try again",201));

    return sendResponse(res,200,"Comment updated successfully",true,comment);
}

const updateCommentText = async (req,res,next) => {
    if(!req.user && !req.admin)
        return next(new ErrorHandler("Please Login!",404));

    const {text} = req?.body;
    const {id} = req?.params;

    if(!text && !id) 
        return next(new ErrorHandler("All fields are required",400));

    const comment = await Comment.findByIdAndUpdate(id,{text});

    if(!comment)
        return next(new ErrorHandler("Comment not updated, please try again",201));

    return sendResponse(res,200,"Comment updated successfully",true,comment);
}

const getAllComment = async (req,res,next) => {
    if(!req.user && !req.admin)
        return next(new ErrorHandler("Please Login!",404));

    const {todoId} = req?.params;

    if(!todoId) 
        return next(new ErrorHandler("Please Provide Todo ID",400));

    const comment = await Comment.find({todo:todoId}).populate("owner");

    if(!comment)
        return next(new ErrorHandler("Comment not found, please try again",201));

    

    return sendResponse(res,200,"Comment fetched successfully",true,comment);
}

export {
    createComment,
    deleteComment,
    updateComment,
    getAllComment,
    updateCommentText
}