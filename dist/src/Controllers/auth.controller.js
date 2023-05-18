"use strict";
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
exports.Login = void 0;
const http_responses_utils_1 = require("../Utils/http_responses.utils");
const http_status_codes_1 = require("http-status-codes");
const user_model_1 = __importDefault(require("../Models/user.model"));
const auth_utils_1 = require("../Utils/auth.utils");
function Login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //Destructure the Request Object
        const { body: { email, password }, } = req;
        // Confirm that all required data are passed in the request body
        if (!email) {
            return res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json((0, http_responses_utils_1.bad_request)("Kindly input your email"));
        }
        if (!password) {
            return res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json((0, http_responses_utils_1.bad_request)("Kindly input your password"));
        }
        //Confirm that the user exists,
        try {
            const user = yield user_model_1.default.findOne({ email });
            if (!user) {
                return res
                    .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                    .json((0, http_responses_utils_1.not_found)("User not found"));
            }
            else {
                // Verify the password provided
                const password_is_verified = yield (0, auth_utils_1.verifyPassword)(password, user.password);
                if (password_is_verified) {
                    const token = yield (0, auth_utils_1.create_jwt_token)(user._id, user.email);
                    return res.status(http_status_codes_1.StatusCodes.OK).json((0, http_responses_utils_1.Ok)(token));
                }
                else {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json((0, http_responses_utils_1.unauthorized)("Incorrect password"));
                }
            }
        }
        catch (err) {
            return res
                .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .json((0, http_responses_utils_1.internal_server_error)("An error occured while user was logging in"));
        }
    });
}
exports.Login = Login;
