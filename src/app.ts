import express from "express";
import cors from "cors";
import router from "./Routes";

const app = express();

//Allow cors connection
app.use(cors());
app.use(express.json());
app.use("/", router);

export default app;
