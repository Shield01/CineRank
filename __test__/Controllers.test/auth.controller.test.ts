import User from "../../src/Models/user.model";
import { Login } from "../../src/Controllers/auth.controller";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as auth from "../../src/Utils/auth.utils";

jest.mock("../../src/Models/user.model", () => ({
  User: {
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

describe("Login", () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        password: "password",
      },
    } as Request;
    res = mockResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return BAD_REQUEST if email is missing", async () => {
    delete req.body.email;

    await Login(req, res);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      httpStatus: "Bad Request",
      message: "Kindly input your email",
    });
  });

  it("should return BAD_REQUEST if password is missing", async () => {
    delete req.body.password;

    await Login(req, res);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      httpStatus: "Bad Request",
      message: "Kindly input your password",
    });
  });

  it("should return NOT_FOUND if user does not exist", async () => {
    User.findOne = jest.fn().mockResolvedValue(null);

    await Login(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      httpStatus: "Not found",
      message: "User not found",
    });
  });

  it("should return UNAUTHORIZED if password is incorrect", async () => {
    const mockUser = { password: "hashedPassword" };
    User.findOne = jest.fn().mockResolvedValue(mockUser);
    jest.spyOn(auth, "verifyPassword").mockResolvedValue(false);

    await Login(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
    expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({
      httpStatus: "Unauthorized",
      message: "Incorrect password",
    });
  });

  it("should return OK with token if login is successful", async () => {
    const mockUser = {
      _id: "userId",
      email: "test@example.com",
      password: "hashedPassword",
    };
    User.findOne = jest.fn().mockResolvedValue(mockUser);
    jest.spyOn(auth, "verifyPassword").mockResolvedValue(true);
    jest
      .spyOn(auth, "create_jwt_token")
      .mockResolvedValue("create_jwt_token" as never);

    await Login(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.json).toHaveBeenCalledWith({
      httpStatus: "Ok",
      message: "create_jwt_token",
    });
  });

  it("should return INTERNAL_SERVER_ERROR if an error occurs", async () => {
    User.findOne = jest.fn().mockRejectedValue(new Error("Database error"));

    await Login(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
    expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      httpStatus: "Internal server error",
      message: "An error occured while user was logging in",
    });
  });
});
