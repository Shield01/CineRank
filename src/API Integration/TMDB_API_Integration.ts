import "dotenv/config";
import axios from "axios";

const instance = axios.create({
  baseURL: `${process.env.TMDB_BASE_URL}`,
  timeout: 6000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
  },
});

export async function searchForAMovie(movie_name: unknown) {
  const response = await instance.get(
    `${process.env.TMDB_BASE_URL}/search/movie?query=${movie_name}`
  );

  return response;
}

export async function get_a_movie_detail(movie_id: number) {
  const response = await instance.get(
    `${process.env.TMDB_BASE_URL}/movie/${movie_id}`
  );

  return response;
}
