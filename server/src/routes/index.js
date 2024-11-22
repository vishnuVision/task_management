import { Router } from "express";
import { todoRouter } from "../routes/todoRoute.js"
import { authRouter } from "../routes/authRoute.js"
import { subTodoRouter } from "./subTodoRoute.js";
import { commentRouter } from "./commentRoute.js";
import { notificationRouter } from "./notification.js";

const router = Router();

router.use(authRouter);
router.use(notificationRouter)
router.use(commentRouter);
router.use(subTodoRouter);
router.use(todoRouter);



export default router;