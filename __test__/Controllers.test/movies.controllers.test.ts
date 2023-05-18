import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import {
  search_for_movie,
  add_movie_to_top100,
  view_top100,
  remove_from_top100,
  clear_top100_list,
  view_movies_on_local_db,
} from "../../src/Controllers/movies.controller";
import {
  searchForAMovie,
  get_a_movie_detail,
} from "../../src/API Integration/TMDB_API_Integration";
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

const mockResponse = (): Response => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  return res as Response;
};

describe("search_for_movie", () => {
  let req: Request;
  let res;
  let movie_name: string;
  beforeEach(() => {
    movie_name = "Avengers";
    res = mockResponse();
  });

  it("should return results from TMDB api when request is made", async () => {
    res = await request(app).get(
      `/movies/movie_search?movie_name=${movie_name}`
    );

    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body.length).toBeGreaterThan(0);
  }, 60000);

  // Doesn't work yet.
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
  let req: Request;
  let res: Response;
  beforeEach(() => {
    req = {
      body: {
        rank: 10,
      },
      headers: {
        auth_token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjQ2NDYxMTBjNjdhMzJmNDI3NjQ0ZjQwIiwiZW1haWwiOiJ0ZXN0X3VzZXJAdGVzdC5jb20iLCJpYXQiOjE2ODQzMDAwNTksImV4cCI6MTY4NDMwMDY1OX0.UyGxGC8VZsnJcG37CaXPrsafTH2rtlfDxfKFyzA47_I",
      },
      params: {
        movie_id: "123456",
      },
    } as unknown as Request;
    //   base_url = "http://localhost:3000";
    //   movie_name = "Avengers";
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
      decoded_token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjQ2NDYxMTBjNjdhMzJmNDI3NjQ0ZjQwIiwiZW1haWwiOiJ0ZXN0X3VzZXJAdGVzdC5jb20iLCJpYXQiOjE2ODQzMDAwNTksImV4cCI6MTY4NDMwMDY1OX0.UyGxGC8VZsnJcG37CaXPrsafTH2rtlfDxfKFyzA47_I",
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
