import { ErrorHandler } from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";

const socketAuthenticator = async (err,socket,next) => {
    try {
        if(err)
            return next(new ErrorHandler(err,400));

        const token = await socket.request.cookies;

        if(!token)
            return next(new ErrorHandler("Token is required",400));

        if(token.adminToken === undefined && token.userToken === undefined)
            return next(new ErrorHandler("Token is required",400));

        if(token.userToken === undefined)
        {
            const user = await jwt.verify(token.adminToken,process.env.JWT_SECRET);
            if(!user)
                return next(new ErrorHandler("Token is invalid",400));
            socket.user = user;
        }
        else
        {
            const user = await jwt.verify(token.userToken,process.env.JWT_SECRET);
            if(!user)
                return next(new ErrorHandler("Token is invalid",400));
            socket.user = user;
        }
        next();
    } catch (error) {
        return next(new ErrorHandler(error,500));
    }
}

export {
    socketAuthenticator
}