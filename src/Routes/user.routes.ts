import { Router } from "express";
import { userSignupController } from "../Controllers/user.controller";

const user_router = Router();

user_router.post("/signup", userSignupController);

export default user_router;
