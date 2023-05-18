import { Router } from "express";
import { Login } from "../Controllers/auth.controller";

const auth_router = Router();

auth_router.post("/login", Login);

export default auth_router;
