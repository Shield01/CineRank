import { Router } from "express";
import movie_router from "./movies.routes";
import user_router from "./user.routes";
import auth_router from "./auth.routes";

const router = Router();

router.use("/movies", movie_router);
router.use("/user", user_router);
router.use("/auth", auth_router);

export default router;
