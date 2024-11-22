import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { deleteNotifications, getAllNotifications } from "../controllers/notification.controller.js";

const notificationRouter = Router();

notificationRouter.get("/notification",authMiddleware,getAllNotifications);
notificationRouter.delete("/notification",authMiddleware,deleteNotifications);

export 
{
    notificationRouter
}