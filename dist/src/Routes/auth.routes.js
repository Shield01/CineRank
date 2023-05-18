"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../Controllers/auth.controller");
const auth_router = (0, express_1.Router)();
auth_router.post("/login", auth_controller_1.Login);
exports.default = auth_router;
