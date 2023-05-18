import { model, Schema, Document, Mixed } from "mongoose";

export interface MovieDocument extends Document {
  adult: Boolean;
  backdrop_path: String;
  belongs_to_collection: Mixed;
  budget: Number;
  genres: Mixed;
  homepage: String;
  id: Number;
  imdb_id: String;
  original_language: String;
  original_title: String;
  overview: String;
  popularity: Number;
  poster_path: String;
  production_companies: Mixed;
  production_countries: Mixed;
  release_date: String;
  revenue: Number;
  runtime: Number;
  spoken_languages: Mixed;
  status: String;
  tagline: String;
  title: String;
  video: Boolean;
  vote_average: Number;
  vote_count: Number;
}

const MovieSchema = new Schema({
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

const Movie = model<MovieDocument>("Movie", MovieSchema);

export default Movie;
