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
exports.get_a_movie_detail = exports.searchForAMovie = void 0;
require("dotenv/config");
const axios_1 = __importDefault(require("axios"));
const instance = axios_1.default.create({
    baseURL: `${process.env.TMDB_BASE_URL}`,
    timeout: 6000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
    },
});
function searchForAMovie(movie_name) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield instance.get(`${process.env.TMDB_BASE_URL}/search/movie?query=${movie_name}`);
        return response;
    });
}
exports.searchForAMovie = searchForAMovie;
function get_a_movie_detail(movie_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield instance.get(`${process.env.TMDB_BASE_URL}/movie/${movie_id}`);
        return response;
    });
}
exports.get_a_movie_detail = get_a_movie_detail;
