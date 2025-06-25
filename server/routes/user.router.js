import { Router } from "express";
import { login, logout, signup } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/logout", logout);

export default userRouter;
