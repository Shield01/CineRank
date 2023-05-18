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
const http_status_codes_1 = require("http-status-codes");
const supertest_1 = __importDefault(require("supertest"));
const movies_controller_1 = require("../../src/Controllers/movies.controller");
const auth = __importStar(require("../../src/Utils/auth.utils"));
const app_1 = __importDefault(require("../../src/app"));
jest.mock("../../src/Models/user.model", () => ({
    User: {
        findOne: jest.fn(),
    },
}));
jest.mock("../../src/Models/movie.models", () => ({
    Movie: {
    // findOne: jest.fn(),
    },
}));
const mockResponse = () => {
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
    return res;
};
describe("search_for_movie", () => {
    let req;
    let res;
    let base_url;
    let movie_name;
    beforeEach(() => {
        // base_url = "http://localhost:3000";
        movie_name = "Avengers";
        res = mockResponse();
    });
    it("should return results from TMDB api when request is made", () => __awaiter(void 0, void 0, void 0, function* () {
        res = yield (0, supertest_1.default)(app_1.default).get(`/movies/movie_search?movie_name=${movie_name}`);
        expect(res.status).toBe(http_status_codes_1.StatusCodes.OK);
        expect(res.body.length).toBeGreaterThan(0);
    }), 60000);
    //   it("should return internal server error response when an error occurs", async () => {
    //     res = await request(`${base_url}`).get(
    //       `/movies/movie_search?movie_name=${undefined}`
    //     );
    //     expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    //     expect(res.body).toBe({
    //       httpStatus: "Internal server error",
    //       message: "An error occured while searching for movie",
    //     });
    //   });
});
describe("add_movie_to_top100", () => {
    let req;
    let res;
    beforeEach(() => {
        req = {
            body: {
                rank: 10,
            },
            headers: {
                auth_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjQ2NDYxMTBjNjdhMzJmNDI3NjQ0ZjQwIiwiZW1haWwiOiJ0ZXN0X3VzZXJAdGVzdC5jb20iLCJpYXQiOjE2ODQzMDAwNTksImV4cCI6MTY4NDMwMDY1OX0.UyGxGC8VZsnJcG37CaXPrsafTH2rtlfDxfKFyzA47_I",
            },
            params: {
                movie_id: "123456",
            },
        };
        //   base_url = "http://localhost:3000";
        //   movie_name = "Avengers";
        res = mockResponse();
    });
    it("should Return unauthorized when auth token is not supplied", () => __awaiter(void 0, void 0, void 0, function* () {
        delete req.headers.auth_token;
        yield (0, movies_controller_1.add_movie_to_top100)(req, res);
        expect(res.status).toHaveBeenCalledWith(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        expect(res.json).toHaveBeenCalledWith({
            httpStatus: "Unauthorized",
            message: "Auth token must be provided in request header",
        });
    }));
    it("should return unauthorized when token is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(auth, "decode_token").mockResolvedValue({
            valid: false,
            expired: true,
            decoded_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjQ2NDYxMTBjNjdhMzJmNDI3NjQ0ZjQwIiwiZW1haWwiOiJ0ZXN0X3VzZXJAdGVzdC5jb20iLCJpYXQiOjE2ODQzMDAwNTksImV4cCI6MTY4NDMwMDY1OX0.UyGxGC8VZsnJcG37CaXPrsafTH2rtlfDxfKFyzA47_I",
        });
        yield (0, movies_controller_1.add_movie_to_top100)(req, res);
        expect(res.status).toHaveBeenCalledWith(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        expect(res.json).toHaveBeenCalledWith({
            httpStatus: "Unauthorized",
            message: "Token provided is invalid",
        });
    }));
    //Doesn't work yet
    // it("should return successful status when movies is added to top hundred", async () => {
    //   const dummyData = {
    //     movie_list: "movie_object",
    //   };
    //   jest.spyOn(auth, "decode_token").mockResolvedValue({
    //     valid: true,
    //     expired: false,
    //     decoded_token: { user_id: "vuidbo" },
    //   } as unknown as never);
    //   User.findOneAndUpdate = jest.fn().mockResolvedValue(dummyData);
    //   await add_movie_to_top100(req, res);
    //   expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    //   expect(res.json).toHaveBeenCalledWith({
    //     httpStatus: "Ok",
    //     message: "Movie added to the Top100 list",
    //   });
    // });
    // Does not work yet.
    // it("should return INTERNAL_SERVER_ERROR if an error occurs", async () => {
    //   Movie.findOne = jest.fn().mockRejectedValue(new Error("Database error"));
    //   await add_movie_to_top100(req, res);
    //   // expect(Movie.findOne).toHaveBeenCalledWith({ email: req.body.email });
    //   expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
    //   expect(res.json).toHaveBeenCalledWith({
    //     httpStatus: "Internal server error",
    //     message: "An error occurred while trying to add movie to the Top100 list",
    //   });
    // });
});
