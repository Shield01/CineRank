"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../../src/Models/user.model"));
const auth_controller_1 = require("../../src/Controllers/auth.controller");
const http_status_codes_1 = require("http-status-codes");
const auth = __importStar(require("../../src/Utils/auth.utils"));
jest.mock("../../src/Models/user.model", () => ({
    User: {
        findOne: jest.fn(),
    },
}));
const mockResponse = () => {
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
    return res;
};
describe("Login", () => {
    let req;
    let res;
    beforeEach(() => {
        req = {
            body: {
                email: "test@example.com",
                password: "password",
            },
        };
        res = mockResponse();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should return BAD_REQUEST if email is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        delete req.body.email;
        yield (0, auth_controller_1.Login)(req, res);
        expect(res.status).toHaveBeenCalledWith(http_status_codes_1.StatusCodes.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith({
            httpStatus: "Bad Request",
            message: "Kindly input your email",
        });
    }));
    it("should return BAD_REQUEST if password is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        delete req.body.password;
        yield (0, auth_controller_1.Login)(req, res);
        expect(res.status).toHaveBeenCalledWith(http_status_codes_1.StatusCodes.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith({
            httpStatus: "Bad Request",
            message: "Kindly input your password",
        });
    }));
    it("should return NOT_FOUND if user does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        user_model_1.default.findOne = jest.fn().mockResolvedValue(null);
        yield (0, auth_controller_1.Login)(req, res);
        expect(user_model_1.default.findOne).toHaveBeenCalledWith({ email: req.body.email });
        expect(res.status).toHaveBeenCalledWith(http_status_codes_1.StatusCodes.NOT_FOUND);
        expect(res.json).toHaveBeenCalledWith({
            httpStatus: "Not found",
            message: "User not found",
        });
    }));
    it("should return UNAUTHORIZED if password is incorrect", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUser = { password: "hashedPassword" };
        user_model_1.default.findOne = jest.fn().mockResolvedValue(mockUser);
        jest.spyOn(auth, "verifyPassword").mockResolvedValue(false);
        yield (0, auth_controller_1.Login)(req, res);
        expect(user_model_1.default.findOne).toHaveBeenCalledWith({ email: req.body.email });
        expect(res.status).toHaveBeenCalledWith(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        expect(res.json).toHaveBeenCalledWith({
            httpStatus: "Unauthorized",
            message: "Incorrect password",
        });
    }));
    it("should return OK with token if login is successful", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUser = {
            _id: "userId",
            email: "test@example.com",
            password: "hashedPassword",
        };
        user_model_1.default.findOne = jest.fn().mockResolvedValue(mockUser);
        jest.spyOn(auth, "verifyPassword").mockResolvedValue(true);
        jest
            .spyOn(auth, "create_jwt_token")
            .mockResolvedValue("create_jwt_token");
        yield (0, auth_controller_1.Login)(req, res);
        expect(user_model_1.default.findOne).toHaveBeenCalledWith({ email: req.body.email });
        expect(res.status).toHaveBeenCalledWith(http_status_codes_1.StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
            httpStatus: "Ok",
            message: "create_jwt_token",
        });
    }));
    it("should return INTERNAL_SERVER_ERROR if an error occurs", () => __awaiter(void 0, void 0, void 0, function* () {
        user_model_1.default.findOne = jest.fn().mockRejectedValue(new Error("Database error"));
        yield (0, auth_controller_1.Login)(req, res);
        expect(user_model_1.default.findOne).toHaveBeenCalledWith({ email: req.body.email });
        expect(res.status).toHaveBeenCalledWith(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res.json).toHaveBeenCalledWith({
            httpStatus: "Internal server error",
            message: "An error occured while user was logging in",
        });
    }));
});
