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
const user_controller_1 = require("../../src/Controllers/user.controller");
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
describe("Sign up", () => {
    let req;
    let res;
    beforeEach(() => {
        req = {
            body: {
                email: "test@example.com",
                password: "password",
                first_name: "test",
                last_name: "user",
            },
        };
        res = mockResponse();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should return BAD_REQUEST if first_name is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        delete req.body.first_name;
        yield (0, user_controller_1.userSignupController)(req, res);
        expect(res.status).toHaveBeenCalledWith(http_status_codes_1.StatusCodes.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith({
            httpStatus: "Bad Request",
            message: "Firstname must be inputed",
        });
    }));
    it("should return BAD_REQUEST if last_name is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        delete req.body.last_name;
        yield (0, user_controller_1.userSignupController)(req, res);
        expect(res.status).toHaveBeenCalledWith(http_status_codes_1.StatusCodes.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith({
            httpStatus: "Bad Request",
            message: "Lastname must be inputed",
        });
    }));
    it("should return BAD_REQUEST if email is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        delete req.body.email;
        yield (0, user_controller_1.userSignupController)(req, res);
        expect(res.status).toHaveBeenCalledWith(http_status_codes_1.StatusCodes.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith({
            httpStatus: "Bad Request",
            message: "Email must be inputed",
        });
    }));
    it("should return BAD_REQUEST if password is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        delete req.body.password;
        yield (0, user_controller_1.userSignupController)(req, res);
        expect(res.status).toHaveBeenCalledWith(http_status_codes_1.StatusCodes.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith({
            httpStatus: "Bad Request",
            message: "Password must be inputed",
        });
    }));
    it("should inform client if user already exists", () => __awaiter(void 0, void 0, void 0, function* () {
        user_model_1.default.findOne = jest.fn().mockResolvedValue(req.body);
        yield (0, user_controller_1.userSignupController)(req, res);
        expect(res.status).toHaveBeenCalledWith(http_status_codes_1.StatusCodes.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith({
            httpStatus: "Bad Request",
            message: "User already exists",
        });
    }));
    it("should inform client when user succcessfully signs up", () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(auth, "hashPassword").mockResolvedValue(req.body.password);
        user_model_1.default.findOne = jest.fn().mockResolvedValue(null);
        user_model_1.default.create = jest.fn().mockResolvedValue(req.body);
        yield (0, user_controller_1.userSignupController)(req, res);
        expect(user_model_1.default.create).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(http_status_codes_1.StatusCodes.CREATED);
        expect(res.json).toHaveBeenCalledWith({
            httpStatus: "Created",
            message: "User created",
        });
    }));
    it("should return INTERNAL_SERVER_ERROR if an error occurs", () => __awaiter(void 0, void 0, void 0, function* () {
        user_model_1.default.findOne = jest.fn().mockRejectedValue(new Error("Database error"));
        yield (0, user_controller_1.userSignupController)(req, res);
        expect(user_model_1.default.findOne).toHaveBeenCalledWith({ email: req.body.email });
        expect(res.status).toHaveBeenCalledWith(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res.json).toHaveBeenCalledWith({
            httpStatus: "Internal server error",
            message: "An error occured when creating the user",
        });
    }));
});
