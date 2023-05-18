import Movie from "../Models/movie.models";

export async function get_movie_local_details(movie_id: string) {
  const result = await Movie.findOne({ _id: movie_id });

  return result;
}
