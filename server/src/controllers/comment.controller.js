import { Comment } from "../db/models/comment.model.js";
import { Todo } from "../db/models/todoModels.js";
import { User } from "../db/models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { emitEvent } from "../utils/getMemberSocket.js";
import { sendResponse } from "../utils/sendResponse.js";

const createComment = async (req,res,next) => {
    try {
        if(!req.user && !req.admin)
            return next(new ErrorHandler("Please Login!",404));
    
        const {text,todo} = req?.body;
        let path;
        if(req.file)
        {
            path = req.file.path;
        }
        
        let owner;
    
        if(req.user)
        {
            owner = req.user._id;
        }
        else
        {
            owner = req.admin._id;
        }

        if((!text && !path) || !owner) 
            return next(new ErrorHandler("All fields are required backend",400));

        let image;

        if(path)
        {
            image = await uploadOnCloudinary(path);
            if(!image)
                return next(new ErrorHandler("Something wrong in Cloudinary",500));
        }
        
        const comment = await Comment.create({text,image:image?.url,owner,todo});
    
        if(!comment)
            return next(new ErrorHandler("Comment not created, please try again",201));

        const ownerData = await User.findById(comment?.owner).select("-createdAt -updatedAt -__v -password -name -_id -email").lean();
   
        if(!ownerData)
            return next(new ErrorHandler("Comment owner not found, please try again",201));
    
        const todoData = await Todo.findById(comment?.todo);
    
        if(!todoData)
            return next(new ErrorHandler("Comment todo not found, please try again",201));
    
        emitEvent(req , next , "NEW_COMMENT" , comment , todoData.owner.filter((member)=>member.toString() !== owner.toString()));
        emitEvent(req , next , "NEW_NOTIFICATION" , {...comment._doc,owner:ownerData,message:"Commented on your todo"} , todoData.owner.filter((member)=>member.toString() !== owner.toString()));
    
        return sendResponse(res,200,"Comment created successfully",true,comment);
    } catch (error) {
        return next(new ErrorHandler(error.message || "An unexpected error occurred",404));
    }
}

const deleteComment = async (req,res,next) => {
    try {
        if(!req.user && !req.admin)
            return next(new ErrorHandler("Please Login!",404));
    
        const {id} = req?.params;
    
        if(!id) 
            return next(new ErrorHandler("All fields are required",400));
    
        const comment = await Comment.findByIdAndDelete(id);
    
        if(!comment)
            return next(new ErrorHandler("Comment not deleted, please try again",201));
    
        return sendResponse(res,200,"Comment deleted successfully",true,comment);
    } catch (error) {
        return next(new ErrorHandler(error.message || "An unexpected error occurred",404));
    }
}

const updateComment = async (req,res,next) => {
    try {
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
    } catch (error) {
        return next(new ErrorHandler(error.message || "An unexpected error occurred",404));
    }
}

const updateCommentText = async (req,res,next) => {
    try {
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
    } catch (error) {
        return next(new ErrorHandler(error.message || "An unexpected error occurred",404));
    }
}

const getAllComment = async (req,res,next) => {
    try {
        if(!req.user && !req.admin)
            return next(new ErrorHandler("Please Login!",404));
    
        const {todoId} = req?.params;
    
        if(!todoId) 
            return next(new ErrorHandler("Please Provide Todo ID",400));
    
        const comment = await Comment.find({todo:todoId}).populate("owner");
    
        if(!comment)
            return next(new ErrorHandler("Comment not found, please try again",201));
    
        return sendResponse(res,200,"Comment fetched successfully",true,comment);
    } catch (error) {
        return next(new ErrorHandler(error.message || "An unexpected error occurred",404));
    }
}

export {
    createComment,
    deleteComment,
    updateComment,
    getAllComment,
    updateCommentText
}