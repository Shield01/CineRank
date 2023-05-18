"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../Controllers/user.controller");
const user_router = (0, express_1.Router)();
user_router.post("/signup", user_controller_1.userSignupController);
exports.default = user_router;
