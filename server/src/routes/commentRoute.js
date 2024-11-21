import { Router } from "express";
import { authMiddleware,adminauthMiddleware } from "../middleware/auth.middleware.js";
import { createComment, deleteComment, getAllComment, updateComment,updateCommentText } from "../controllers/comment.controller.js";
import { upload } from "../middleware/multer.js";

const commentRouter = Router();

commentRouter.get("/comments/:todoId",authMiddleware,getAllComment);
commentRouter.post("/createComment",upload.single("image"),authMiddleware,createComment);
commentRouter.put("/updateComment/:id",upload.single("image"),authMiddleware,updateComment);
commentRouter.put("/updateCommentText/:id",authMiddleware,updateCommentText);
commentRouter.delete("/deleteComment/:id",authMiddleware,deleteComment);


export 
{
    commentRouter
}