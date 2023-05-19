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
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const movies_controller_1 = require("../../src/Controllers/movies.controller");
const API = __importStar(require("../../src/API Integration/TMDB_API_Integration"));
const auth = __importStar(require("../../src/Utils/auth.utils"));
jest.mock("../../src/Models/user.model", () => ({
    User: {
        findOne: jest.fn(),
    },
}));
jest.mock("../../src/Models/movie.models", () => ({
    Movie: {
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
describe("search_for_movie", () => {
    let req;
    let res;
    let movie_name;
    beforeEach(() => {
        req = {
            body: {
                email: "test@example.com",
                password: "password",
            },
            query: {
                movie_name: "Avengers",
            },
            headers: {
                auth_token: "randomstring",
            },
        };
        res = mockResponse();
    });
    it("should return results from TMDB api when request is made", () => __awaiter(void 0, void 0, void 0, function* () {
        // Movie.findOne = jest.fn().mockResolvedValue([{ dummyMovie: "dummyMovie" }]);
        jest
            .spyOn(API, "searchForAMovie")
            .mockResolvedValue(res);
        yield (0, movies_controller_1.search_for_movie)(req, res);
        expect(res.status).toHaveBeenCalledWith(http_status_codes_1.StatusCodes.OK);
    }), 60000);
    it("should return internal server error response when an error occurs", () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(API, "searchForAMovie").mockRejectedValue(new Error("An error"));
        yield (0, movies_controller_1.search_for_movie)(req, res);
        expect(res.status).toHaveBeenCalledWith(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res.json).toHaveBeenCalledWith({
            httpStatus: "Internal server error",
            message: "An error occured while searching for movie",
        });
    }));
});
describe("add_movie_to_top100", () => {
    let req;
    let res;
    beforeEach(() => {
        req = {
            body: {
                rank: 10,
                email: "test@example.com",
                password: "password",
            },
            headers: {
                auth_token: "random_text",
            },
            params: {
                movie_id: "123456",
            },
        };
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
            decoded_token: "random_text",
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
    //   const mockUser = {
    //     _id: "userId",
    //     email: "test@example.com",
    //     password: "hashedPassword",
    //   };
    //   User.findOne = jest.fn().mockResolvedValue(mockUser);
    //   jest.spyOn(auth, "verifyPassword").mockResolvedValue(true);
    //   jest
    //     .spyOn(auth, "create_jwt_token")
    //     .mockResolvedValue("create_jwt_token" as never);
    //   await Login(req, res);
    //   jest.spyOn(auth, "decode_token").mockResolvedValue("decode_token" as never);
    //   User.findOneAndUpdate = jest.fn().mockResolvedValue(dummyData);
    //   await add_movie_to_top100(req, res);
    //   // expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    //   expect(res.json).toHaveBeenCalledWith({
    //     httpStatus: "Ok",
    //     message: "Movie added to the Top100 list",
    //   });
    // });
    // Does not work yet.
    // it("should return INTERNAL_SERVER_ERROR if an error occurs", async () => {
    //   Movie.findOne = jest.fn().mockRejectedValue(new Error("Database error"));
    //   jest
    //     .spyOn(auth, "decode_token")
    //     .mockResolvedValue(req.headers.auth_token as unknown as never);
    //   await add_movie_to_top100(req, res);
    //   // expect(Movie.findOne).toHaveBeenCalledWith({ email: req.body.email });
    //   expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
    //   expect(res.json).toHaveBeenCalledWith({
    //     httpStatus: "Internal server error",
    //     message: "An error occurred while trying to add movie to the Top100 list",
    //   });
    // });
});
// describe("view_top100", () => {
//   let req: Request;
//   let res: Response;
//   // let movie_name: string;
//   beforeEach(() => {
//     req = {
//       query: {
//         movie_name: "Avengers",
//       },
//       headers: {
//         auth_token: "randomstring",
//       },
//     } as unknown as Request;
//     res = mockResponse();
//   });
//   it("should return an array of movies", async () => {
//     const dummyData = { movie_name: "movie_name" };
//     User.findOne = jest.fn().mockResolvedValue({ movie_list: [] });
//     await view_top100(req, res);
//     jest
//       .spyOn(MovieUtil, "get_movie_local_details")
//       .mockResolvedValue(dummyData as any);
//     expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
//     expect(typeof res.json).toBe("object");
//   });
// });
describe("remove_from_top100", () => { });
describe("clear_top100_list", () => { });
describe("view_movies_on_local_db", () => { });
