import { Router, Request, Response } from "express";
import movie_router from "./movies.routes";
import user_router from "./user.routes";
import auth_router from "./auth.routes";

const router = Router();

router.use("/movies", movie_router);
router.use("/user", user_router);
router.use("/auth", auth_router);

router.get("/", (req: Request, res: Response) => {
  return res.status(200).send({ message: "Welcome to the CineRank app" });
});

export default router;
