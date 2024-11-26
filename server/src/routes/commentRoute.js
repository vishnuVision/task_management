import { Router } from "express";
import { authMiddleware,adminauthMiddleware } from "../middleware/auth.middleware.js";
import { createComment, deleteComment, getAllComment, deleteImage,updateCommentText } from "../controllers/comment.controller.js";
import { upload } from "../middleware/multer.js";

const commentRouter = Router();

commentRouter.get("/comments/:todoId",authMiddleware,getAllComment);
commentRouter.delete("/updateComment/:id",authMiddleware,deleteImage);
commentRouter.post("/createComment",upload.single("image"),authMiddleware,createComment);
commentRouter.put("/updateCommentText/:id",authMiddleware,updateCommentText);
commentRouter.delete("/deleteComment/:id",authMiddleware,deleteComment);


export 
{
    commentRouter
}