import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Login } from "../../src/Controllers/auth.controller";

import request from "supertest";
import {
  search_for_movie,
  add_movie_to_top100,
  view_top100,
  remove_from_top100,
  clear_top100_list,
  view_movies_on_local_db,
} from "../../src/Controllers/movies.controller";
import * as API from "../../src/API Integration/TMDB_API_Integration";
import * as auth from "../../src/Utils/auth.utils";
import {
  unauthorized,
  Ok,
  internal_server_error,
  not_found,
} from "../../src/Utils/http_responses.utils";
import Movie from "../../src/Models/movie.models";
import User from "../../src/Models/user.model";
import app from "../../src/app";
import { AxiosResponse } from "axios";
import * as MovieUtil from "../../src/Utils/movie.utils";

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

const mockResponse = (): Response => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  return res as Response;
};

describe("search_for_movie", () => {
  let req: Request;
  let res: Response;
  let movie_name: string;
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
    } as unknown as Request;
    res = mockResponse();
  });

  it("should return results from TMDB api when request is made", async () => {
    // Movie.findOne = jest.fn().mockResolvedValue([{ dummyMovie: "dummyMovie" }]);
    jest
      .spyOn(API, "searchForAMovie")
      .mockResolvedValue(res as unknown as AxiosResponse);

    await search_for_movie(req, res);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
  }, 60000);

  it("should return internal server error response when an error occurs", async () => {
    jest.spyOn(API, "searchForAMovie").mockRejectedValue(new Error("An error"));

    await search_for_movie(req, res);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);

    expect(res.json).toHaveBeenCalledWith({
      httpStatus: "Internal server error",
      message: "An error occured while searching for movie",
    });
  });
});

describe("add_movie_to_top100", () => {
  let req: Request;
  let res: Response;
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
    } as unknown as Request;
    res = mockResponse();
  });

  it("should Return unauthorized when auth token is not supplied", async () => {
    delete req.headers.auth_token;
    await add_movie_to_top100(req, res);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({
      httpStatus: "Unauthorized",
      message: "Auth token must be provided in request header",
    });
  });

  it("should return unauthorized when token is invalid", async () => {
    jest.spyOn(auth, "decode_token").mockResolvedValue({
      valid: false,
      expired: true,
      decoded_token: "random_text",
    } as unknown as never);

    await add_movie_to_top100(req, res);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({
      httpStatus: "Unauthorized",
      message: "Token provided is invalid",
    });
  });

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

describe("remove_from_top100", () => {});

describe("clear_top100_list", () => {});

describe("view_movies_on_local_db", () => {});
