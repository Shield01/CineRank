import { Router } from "express";
import {
  search_for_movie,
  add_movie_to_top100,
  view_top100,
  remove_from_top100,
  clear_top100_list,
  view_movies_on_local_db,
} from "../Controllers/movies.controller";

const movie_router = Router();

movie_router.get("/movie_search", search_for_movie);

movie_router.post("/add_to_top_hundred/:movie_id", add_movie_to_top100);

movie_router.get("/view_my_top100", view_top100);

movie_router.post("/remove_from_top100", remove_from_top100);

movie_router.put("/clear_top100_list", clear_top100_list);

movie_router.get("/get_movies_from_in_house_db", view_movies_on_local_db);

export default movie_router;
