import { Notification } from "../db/models/notification.model.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { sendResponse } from "../utils/sendResponse.js";

const getAllNotifications = async (req,res,next) => {
    try {
        if(!req.user && !req.admin)
            return next(new ErrorHandler("Please Login!",404));

        let receiver;

        if(req.user)
        {    
            receiver = req.user._id;
        }
        else
        {
            receiver = req.admin._id;
        }

        const notifications = await Notification.find({receiver,show:false});
        
        if(!notifications)
            return next(new ErrorHandler("Notifications not found",404));

        return sendResponse(res,200,"Notifications fetched successfully",true,notifications);
    } catch (error) {
        return next(new ErrorHandler(error.message || "An unexpected error occurred",404));
    }
}

const deleteNotifications = async (req,res,next) => {
    try {
        if(!req.user && !req.admin)
            return next(new ErrorHandler("Please Login!",404));

        let receiver;

        if(req.user)
        {    
            receiver = req.user._id;
        }
        else
        {
            receiver = req.admin._id;
        }

        const notifications = await Notification.deleteMany({receiver});
        
        if(!notifications)
            return next(new ErrorHandler("Notifications not found",404));

        return sendResponse(res,200,"Notifications deleted successfully",true,notifications);
    } catch (error) {
        return next(new ErrorHandler(error.message || "An unexpected error occurred",404));
    }
}

export {
    getAllNotifications,
    deleteNotifications
}