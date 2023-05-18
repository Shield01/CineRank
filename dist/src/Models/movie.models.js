"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MovieSchema = new mongoose_1.Schema({
    adult: { type: Boolean },
    backdrop_path: { type: String },
    belongs_to_collection: {
        id: Number,
        name: String,
        poster_path: String,
        backdrop_path: String,
    },
    budget: { type: Number },
    genres: [{}],
    homepage: { type: String },
    id: { type: Number },
    imdb_id: { type: String },
    original_language: { type: String },
    original_title: { type: String },
    overview: { type: String },
    popularity: { type: Number },
    poster_path: { type: String },
    production_companies: [
        {
            id: Number,
            logo_path: String,
            name: String,
            origin_country: String,
        },
    ],
    production_countries: [
        {
            iso_3166_1: String,
            name: String,
        },
    ],
    release_date: { type: String },
    revenue: { type: Number },
    runtime: { type: Number },
    spoken_languages: [
        {
            english_name: String,
            iso_639_1: String,
            name: String,
        },
    ],
    status: { type: String },
    tagline: { type: String },
    title: { type: String },
    video: { type: Boolean },
    vote_average: { type: Number },
    vote_count: { type: Number },
});
const Movie = (0, mongoose_1.model)("Movie", MovieSchema);
exports.default = Movie;
