import { User } from "../db/models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { sendResponse } from "../utils/sendResponse.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ErrorHandler } from "../utils/ErrorHandler.js";

const register = async (req,res,next) => {
    try {
        const {username,name,email,password,admin=false} = req?.body; 

        if(!username || !name || !email || !password) 
            return next(new ErrorHandler("All fields are required",400));

        const {path} = req.file;

        if(!path) 
            return next(new ErrorHandler("Avatar is required",400));

        const cloudinary_file = await uploadOnCloudinary(path);

        if(!cloudinary_file)
            return next(new ErrorHandler("Something wrong in Cloudinary",500));

        const {url:avatar} = cloudinary_file;

        if(!avatar)
            return next(new ErrorHandler("Something wrong in Cloudinary",500));

        const user = await User.create({username,name,email,password,avatar,admin});

        if(!user)
            return next(new ErrorHandler("Something wrong in User Creation",500));

        return sendResponse(res,200,"User Created",true,user,"");
    } catch (error) {
        return next(new ErrorHandler(error.message || "An unexpected error occurred",404));
    }   
}

const login = async (req,res,next) => {  
    try {
        const {email,password,admin=false} = req?.body; 

        if(!email || !password) 
            return next(new ErrorHandler("All fields are required",400));

        const user = await User.findOne({email,admin}).select("-createdAt -updatedAt -__v").lean();

        if(!user)   
            return next(new ErrorHandler("User not found",404));

        const isMatched = await bcrypt.compare(password,user.password);

        if(!isMatched)
            return next(new ErrorHandler("Wrong Password",400));

        const token = await jwt.sign({_id:user._id,username:user.username,email:user.email,name:user.name,avatar:user.avatar,admin:user.admin},process.env.JWT_SECRET);

        if(!token)
            return next(new ErrorHandler("Something wrong in Token Generation",500));

        return sendResponse(res,200,"Login Success",true,user,token,user.admin);
    } catch (error) {
        return next(new ErrorHandler(error.message || "An unexpected error occurred",404));
    }
}

const getUser = async (req,res,next) => {
    try {
        if(!req.user && !req.admin)
            return next(new ErrorHandler("User not found",404));

        let owner;
        if(req.user)
        {
            owner = req.user._id;
        }
        else
        {
            owner = req.admin._id;
        }

        const user = await User.findById(owner).select("-createdAt -updatedAt -__v -password").lean();

        if(!user)
            return next(new ErrorHandler("User not found",404));        

        return sendResponse(res,200,"User Found",true,user,"");
    } catch (error) {
        return next(new ErrorHandler(error.message || "An unexpected error occurred",404));
    }
}

const logout = async (req,res,next) => {
    try {
        if(!req.user && !req.admin)
        {
            return next(new ErrorHandler("User not found",404));
        }
    
        if(req.admin)
        {
            return res
            .status(200)
            .clearCookie("adminToken")
            .json({success:true,message:"Logout Success"});
        }
        return res
        .status(200)
        .clearCookie("userToken")
        .json({success:true,message:"Logout Success"});
    } catch (error) {
        return next(new ErrorHandler(error.message || "An unexpected error occurred",404));
    }
}

const getAllUsers = async (req,res,next) => {
    try {
        if(!req.admin && !req.user)
            return next(new ErrorHandler("Please Login!",404));
    
        const users = await User.find().select("-createdAt -updatedAt -__v").lean();    
    
        if(!users)
            return next(new ErrorHandler("Users not found",404));
    
        return sendResponse(res,200,"Users Found",true,users,"");
    } catch (error) {
        return next(new ErrorHandler(error.message || "An unexpected error occurred",404));
    }
}

const updateAvatar = async (req,res,next) => {
    try {
        if(!req.user && !req.admin)
            return next(new ErrorHandler("User not found",404));
        
        let owner;
        if(req.admin)
        {
            owner = req.admin._id;
        }
        else
        {
            owner = req.user._id;
        }

        const path = req?.file?.path;

        if(!path) 
            return next(new ErrorHandler("Avatar is required",400));

        const cloudinary_file = await uploadOnCloudinary(path);

        if(!cloudinary_file)
            return next(new ErrorHandler("Something wrong in Cloudinary",500));

        const {url:avatar} = cloudinary_file;

        if(!avatar)
            return next(new ErrorHandler("Something wrong in Cloudinary",500));

        const user = await User.findByIdAndUpdate(owner,{avatar}).select("-createdAt -updatedAt -__v").lean();

        if(!user)
            return next(new ErrorHandler("Something wrong in User Creation",500));

        return sendResponse(res,200,"User Created",true,user,"")

    } catch (error) {
        return next(new ErrorHandler(error.message || "An unexpected error occurred",404));
    }
}

const updateUser = async (req,res,next) => {
    try {
        if(!req.user && !req.admin)
            return next(new ErrorHandler("User not found",404));
    
        let owner;
        if(req.admin)
        {
            owner = req.admin._id;
        }
        else
        {
            owner = req.user._id;
        }

        const {username,name,email} = req?.body; 

        if(!username || !name || !email) 
            return next(new ErrorHandler("All fields are required",400));

        const user = await User.findByIdAndUpdate(owner,{username,name,email},{new:true}).select("-createdAt -updatedAt -__v -password").lean();

        if(!user)
            return next(new ErrorHandler("Something wrong in User Update",500));

        return sendResponse(res,200,"User Updated",true,user,"");
    } catch (error) {
        return next(new ErrorHandler(error.message || "An unexpected error occurred",404));
    }
}

export {
    register,
    login,
    getUser,
    logout,
    getAllUsers,
    updateAvatar,
    updateUser
}