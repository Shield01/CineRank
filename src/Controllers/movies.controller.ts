import { Request, Response } from "express";
import {
  searchForAMovie,
  get_a_movie_detail,
} from "../API Integration/TMDB_API_Integration";
import { StatusCodes } from "http-status-codes";
import Movie from "../Models/movie.models";
import { decode_token } from "../Utils/auth.utils";
import {
  unauthorized,
  Ok,
  internal_server_error,
  not_found,
} from "../Utils/http_responses.utils";
import { get_movie_local_details } from "../Utils/movie.utils";
import User, { UserDocument } from "../Models/user.model";

export async function search_for_movie(req: Request, res: Response) {
  const {
    query: { movie_name },
  } = req;
  try {
    const { data } = await searchForAMovie(movie_name);

    return res.status(StatusCodes.OK).json(data.results);
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        internal_server_error("An error occured while searching for movie")
      );
  }
}

export async function add_movie_to_top100(req: Request, res: Response) {
  //Destructure the request object
  const {
    params: { movie_id },
    headers: { auth_token },
    body: { rank },
  } = req;

  //Verify that token was provided

  if (!auth_token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(unauthorized("Auth token must be provided in request header"));
  }

  //Verify the users token
  const valid_token = decode_token(auth_token);

  if (!valid_token?.valid) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(unauthorized("Token provided is invalid"));
  }

  //Get the user id from the decoded token
  let user_id;
  if (typeof valid_token.decoded_token != "string") {
    user_id = valid_token.decoded_token?.user_id;
  }

  //Check if movie exists on my db
  const movie_detail_from_my_db = await Movie.findOne({ id: movie_id });

  //If movie does not exist on my db, request from TMDB API
  if (!movie_detail_from_my_db) {
    try {
      //Request for movie detail from TMDB API
      const { data } = await get_a_movie_detail(Number(movie_id));

      //Save movie detail to my db
      const task = await Movie.create(data);

      //Build the movie object

      const movie_object = {
        movie_id: task._id,
        rank,
      };

      // Update the user's top100
      await User.findOneAndUpdate(
        { _id: user_id },
        { $push: { movie_list: movie_object } },
        { new: true, upsert: true }
      );

      // Send successful status
      return res
        .status(StatusCodes.ACCEPTED)
        .json(Ok("Movie added to the Top100 list"));
    } catch (err) {
      console.log(err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          internal_server_error(
            "An error occurred while trying to add movie to the Top100 list"
          )
        );
    }
  } else {
    //Movie exists on my db hence, I add it to the user's list
    try {
      //Build the movie object
      const movie_object = {
        movie_id: movie_detail_from_my_db._id,
        rank,
      };

      // Update the user's top100
      await User.findOneAndUpdate(
        { _id: user_id },
        { $push: { movie_list: movie_object } },
        { new: true, upsert: true }
      );

      //Return successful status
      return res
        .status(StatusCodes.ACCEPTED)
        .json(Ok("Movie added to top hundred"));
    } catch (err) {
      console.log(err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          internal_server_error(
            "An error occurred while trying to add movie to the Top100 list"
          )
        );
    }
  }
}

export async function view_top100(req: Request, res: Response) {
  const user = await pre_request_activities(req, res);
  // Declare an empty response array
  const response: Array<unknown> = [];

  //Populate the response array....
  if ("movie_list" in user) {
    const movie_list = user.movie_list;

    for (let i = 0; i < movie_list.length; i++) {
      let currentObject = movie_list[i];
      const detail = await get_movie_local_details(currentObject.movie_id);
      response.push(detail);
    }
  }

  return res.status(StatusCodes.OK).json(Ok(response));
}

export async function remove_from_top100(req: Request, res: Response) {
  const {
    body: { movie_id },
  } = req;

  const user = await pre_request_activities(req, res);

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

      await User.findOneAndUpdate(
        { _id: user._id },
        { movie_list: movie_list },
        { new: true, upsert: true }
      );

      return res
        .status(StatusCodes.OK)
        .json(Ok("Movie removed from Top100 list"));
    } else {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          internal_server_error(
            "Invalid data type while removing movie from top100 list"
          )
        );
    }
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        internal_server_error(
          "An error occured while removing movie from top100 list"
        )
      );
  }
}

export async function clear_top100_list(req: Request, res: Response) {
  const user = await pre_request_activities(req, res);

  try {
    if ("movie_list" in user) {
      await User.findOneAndUpdate(
        { _id: user._id },
        { movie_list: [] },
        { new: true, upsert: true }
      );

      return res
        .status(StatusCodes.OK)
        .json(Ok("Top100 list successfully cleared"));
    } else {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          internal_server_error("Invalid data type while clearing top100 list")
        );
    }
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        internal_server_error("An error occured while clearing top100 list")
      );
  }
}

export async function view_movies_on_local_db(req: Request, res: Response) {
  const {
    headers: { auth_token },
  } = req;

  //Verify that token was provided

  if (!auth_token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(unauthorized("Auth token must be provided in request header"));
  }

  //Verify the users token
  const valid_token = decode_token(auth_token);
  if (!valid_token?.valid) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(unauthorized("Token provided is invalid"));
  }

  //Get the user id from the decoded token
  let user_id;
  if (typeof valid_token.decoded_token != "string") {
    user_id = valid_token.decoded_token?.user_id;
  }
  try {
    // Get the user's document
    const user = await User.findOne({ _id: user_id });

    if (user) {
      const movies = await Movie.find();

      return res.status(StatusCodes.OK).json(Ok(movies));
    } else {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(not_found("User not found"));
    }
  } catch (err) {
    return res
      .status(StatusCodes.OK)
      .json(
        internal_server_error(
          "An error occurred while fetching movie details from the db"
        )
      );
  }
}

async function pre_request_activities(
  req: Request,
  res: Response
): Promise<UserDocument | Response> {
  const {
    headers: { auth_token },
  } = req;

  //Verify that token was provided

  if (!auth_token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(unauthorized("Auth token must be provided in request header"));
  }

  //Verify the users token
  const valid_token = decode_token(auth_token);

  if (!valid_token?.valid) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(unauthorized("Token provided is invalid"));
  }

  //Get the user id from the decoded token
  let user_id;
  if (typeof valid_token.decoded_token != "string") {
    user_id = valid_token.decoded_token?.user_id;
  }

  // Get the user's document
  const user = await User.findOne({ _id: user_id });

  if (user) {
    return user;
  } else {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(not_found("User not found"));
  }
}
