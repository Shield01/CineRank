"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const movies_routes_1 = __importDefault(require("./movies.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const router = (0, express_1.Router)();
router.use("/movies", movies_routes_1.default);
router.use("/user", user_routes_1.default);
router.use("/auth", auth_routes_1.default);
router.get("/", (req, res) => {
    return res.status(200).send({ message: "Welcome to the CineRank app" });
});
exports.default = router;
