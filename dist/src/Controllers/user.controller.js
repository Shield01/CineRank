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
exports.userSignupController = void 0;
const user_model_1 = __importDefault(require("../Models/user.model"));
const http_status_codes_1 = require("http-status-codes");
const http_responses_utils_1 = require("../Utils/http_responses.utils");
const auth_utils_1 = require("../Utils/auth.utils");
function userSignupController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { body: { first_name, last_name, email, password }, } = req;
        //Confirm that the required data is sent in the request
        if (!first_name) {
            return res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json((0, http_responses_utils_1.bad_request)("Firstname must be inputed"));
        }
        if (!last_name) {
            return res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json((0, http_responses_utils_1.bad_request)("Lastname must be inputed"));
        }
        if (!email) {
            return res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json((0, http_responses_utils_1.bad_request)("Email must be inputed"));
        }
        if (!password) {
            return res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json((0, http_responses_utils_1.bad_request)("Password must be inputed"));
        }
        try {
            // Check if the user already exists, else create the user
            const user_exists = yield user_model_1.default.findOne({ email });
            // If user exists, inform the client
            if (user_exists) {
                return res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json((0, http_responses_utils_1.bad_request)("User already exists"));
            }
            else {
                //Compute hashed password
                const hashed_password = yield (0, auth_utils_1.hashPassword)(password);
                //Create the user on the database
                yield user_model_1.default.create({
                    first_name,
                    last_name,
                    email,
                    password: hashed_password,
                });
                // return successful response to the client
                return res.status(http_status_codes_1.StatusCodes.CREATED).json((0, http_responses_utils_1.created)("User created"));
            }
        }
        catch (err) {
            /*If an error occurs in the try block above, log the error to the console, and send a response
              to the client*/
            return res
                .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .json((0, http_responses_utils_1.internal_server_error)("An error occured when creating the user"));
        }
    });
}
exports.userSignupController = userSignupController;
