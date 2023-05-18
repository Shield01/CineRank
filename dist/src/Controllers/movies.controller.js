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
exports.view_movies_on_local_db = exports.clear_top100_list = exports.remove_from_top100 = exports.view_top100 = exports.add_movie_to_top100 = exports.search_for_movie = void 0;
const TMDB_API_Integration_1 = require("../API Integration/TMDB_API_Integration");
const http_status_codes_1 = require("http-status-codes");
const movie_models_1 = __importDefault(require("../Models/movie.models"));
const auth_utils_1 = require("../Utils/auth.utils");
const http_responses_utils_1 = require("../Utils/http_responses.utils");
const movie_utils_1 = require("../Utils/movie.utils");
const user_model_1 = __importDefault(require("../Models/user.model"));
function search_for_movie(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { query: { movie_name }, } = req;
        try {
            const { data } = yield (0, TMDB_API_Integration_1.searchForAMovie)(movie_name);
            return res.status(http_status_codes_1.StatusCodes.OK).json(data.results);
        }
        catch (err) {
            return res
                .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .json((0, http_responses_utils_1.internal_server_error)("An error occured while searching for movie"));
        }
    });
}
exports.search_for_movie = search_for_movie;
function add_movie_to_top100(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        //Destructure the request object
        const { params: { movie_id }, headers: { auth_token }, body: { rank }, } = req;
        //Verify that token was provided
        if (!auth_token) {
            return res
                .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                .json((0, http_responses_utils_1.unauthorized)("Auth token must be provided in request header"));
        }
        //Verify the users token
        const valid_token = (0, auth_utils_1.decode_token)(auth_token);
        if (!(valid_token === null || valid_token === void 0 ? void 0 : valid_token.valid)) {
            return res
                .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                .json((0, http_responses_utils_1.unauthorized)("Token provided is invalid"));
        }
        //Get the user id from the decoded token
        let user_id;
        if (typeof valid_token.decoded_token != "string") {
            user_id = (_a = valid_token.decoded_token) === null || _a === void 0 ? void 0 : _a.user_id;
        }
        //Check if movie exists on my db
        const movie_detail_from_my_db = yield movie_models_1.default.findOne({ id: movie_id });
        //If movie does not exist on my db, request from TMDB API
        if (!movie_detail_from_my_db) {
            try {
                //Request for movie detail from TMDB API
                const { data } = yield (0, TMDB_API_Integration_1.get_a_movie_detail)(Number(movie_id));
                //Save movie detail to my db
                const task = yield movie_models_1.default.create(data);
                //Build the movie object
                const movie_object = {
                    movie_id: task._id,
                    rank,
                };
                // Update the user's top100
                yield user_model_1.default.findOneAndUpdate({ _id: user_id }, { $push: { movie_list: movie_object } }, { new: true, upsert: true });
                // Send successful status
                return res
                    .status(http_status_codes_1.StatusCodes.ACCEPTED)
                    .json((0, http_responses_utils_1.Ok)("Movie added to the Top100 list"));
            }
            catch (err) {
                console.log(err);
                return res
                    .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json((0, http_responses_utils_1.internal_server_error)("An error occurred while trying to add movie to the Top100 list"));
            }
        }
        else {
            //Movie exists on my db hence, I add it to the user's list
            try {
                //Build the movie object
                const movie_object = {
                    movie_id: movie_detail_from_my_db._id,
                    rank,
                };
                // Update the user's top100
                yield user_model_1.default.findOneAndUpdate({ _id: user_id }, { $push: { movie_list: movie_object } }, { new: true, upsert: true });
                //Return successful status
                return res
                    .status(http_status_codes_1.StatusCodes.ACCEPTED)
                    .json((0, http_responses_utils_1.Ok)("Movie added to top hundred"));
            }
            catch (err) {
                console.log(err);
                return res
                    .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json((0, http_responses_utils_1.internal_server_error)("An error occurred while trying to add movie to the Top100 list"));
            }
        }
    });
}
exports.add_movie_to_top100 = add_movie_to_top100;
function view_top100(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield pre_request_activities(req, res);
        // Declare an empty response array
        const response = [];
        //Populate the response array.... This is a very crude approach that can be optimized
        if ("movie_list" in user) {
            const movie_list = user.movie_list;
            for (let i = 0; i < movie_list.length; i++) {
                let currentObject = movie_list[i];
                const detail = yield (0, movie_utils_1.get_movie_local_details)(currentObject.movie_id);
                response.push(detail);
            }
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json((0, http_responses_utils_1.Ok)(response));
    });
}
exports.view_top100 = view_top100;
function remove_from_top100(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { body: { movie_id }, } = req;
        const user = yield pre_request_activities(req, res);
        try {
            if ("movie_list" in user) {
                const movie_list = user.movie_list;
                for (let i = 0; i < movie_list.length; i++) {
                    let currentObject = movie_list[i];
                    if (currentObject.movie_id == movie_id) {
                        movie_list.splice(i, 1);
                        break;
                    }
                }
                yield user_model_1.default.findOneAndUpdate({ _id: user._id }, { movie_list: movie_list }, { new: true, upsert: true });
                return res
                    .status(http_status_codes_1.StatusCodes.OK)
                    .json((0, http_responses_utils_1.Ok)("Movie removed from Top100 list"));
            }
            else {
                return res
                    .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json((0, http_responses_utils_1.internal_server_error)("Invalid data type while removing movie from top100 list"));
            }
        }
        catch (err) {
            console.log(err);
            return res
                .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .json((0, http_responses_utils_1.internal_server_error)("An error occured while removing movie from top100 list"));
        }
    });
}
exports.remove_from_top100 = remove_from_top100;
function clear_top100_list(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield pre_request_activities(req, res);
        try {
            if ("movie_list" in user) {
                yield user_model_1.default.findOneAndUpdate({ _id: user._id }, { movie_list: [] }, { new: true, upsert: true });
                return res
                    .status(http_status_codes_1.StatusCodes.OK)
                    .json((0, http_responses_utils_1.Ok)("Top100 list successfully cleared"));
            }
            else {
                return res
                    .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json((0, http_responses_utils_1.internal_server_error)("Invalid data type while clearing top100 list"));
            }
        }
        catch (err) {
            console.log(err);
            return res
                .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .json((0, http_responses_utils_1.internal_server_error)("An error occured while clearing top100 list"));
        }
    });
}
exports.clear_top100_list = clear_top100_list;
function view_movies_on_local_db(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { headers: { auth_token }, } = req;
        //Verify that token was provided
        if (!auth_token) {
            return res
                .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                .json((0, http_responses_utils_1.unauthorized)("Auth token must be provided in request header"));
        }
        //Verify the users token
        const valid_token = (0, auth_utils_1.decode_token)(auth_token);
        if (!(valid_token === null || valid_token === void 0 ? void 0 : valid_token.valid)) {
            return res
                .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                .json((0, http_responses_utils_1.unauthorized)("Token provided is invalid"));
        }
        //Get the user id from the decoded token
        let user_id;
        if (typeof valid_token.decoded_token != "string") {
            user_id = (_a = valid_token.decoded_token) === null || _a === void 0 ? void 0 : _a.user_id;
        }
        try {
            // Get the user's document
            const user = yield user_model_1.default.findOne({ _id: user_id });
            if (user) {
                const movies = yield movie_models_1.default.find();
                return res.status(http_status_codes_1.StatusCodes.OK).json((0, http_responses_utils_1.Ok)(movies));
            }
            else {
                return res
                    .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                    .json((0, http_responses_utils_1.not_found)("User not found"));
            }
        }
        catch (err) {
            return res
                .status(http_status_codes_1.StatusCodes.OK)
                .json((0, http_responses_utils_1.internal_server_error)("An error occurred while fetching movie details from the db"));
        }
    });
}
exports.view_movies_on_local_db = view_movies_on_local_db;
function pre_request_activities(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { headers: { auth_token }, } = req;
        //Verify that token was provided
        if (!auth_token) {
            return res
                .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                .json((0, http_responses_utils_1.unauthorized)("Auth token must be provided in request header"));
        }
        //Verify the users token
        const valid_token = (0, auth_utils_1.decode_token)(auth_token);
        if (!(valid_token === null || valid_token === void 0 ? void 0 : valid_token.valid)) {
            return res
                .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                .json((0, http_responses_utils_1.unauthorized)("Token provided is invalid"));
        }
        //Get the user id from the decoded token
        let user_id;
        if (typeof valid_token.decoded_token != "string") {
            user_id = (_a = valid_token.decoded_token) === null || _a === void 0 ? void 0 : _a.user_id;
        }
        // Get the user's document
        const user = yield user_model_1.default.findOne({ _id: user_id });
        if (user) {
            return user;
        }
        else {
            return res
                .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                .json((0, http_responses_utils_1.not_found)("User not found"));
        }
    });
}
