import User from "../../src/Models/user.model";
import { userSignupController } from "../../src/Controllers/user.controller";
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

describe("Sign up", () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        password: "password",
        first_name: "test",
        last_name: "user",
      },
    } as Request;
    res = mockResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return BAD_REQUEST if first_name is missing", async () => {
    delete req.body.first_name;

    await userSignupController(req, res);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      httpStatus: "Bad Request",
      message: "Firstname must be inputed",
    });
  });

  it("should return BAD_REQUEST if last_name is missing", async () => {
    delete req.body.last_name;

    await userSignupController(req, res);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      httpStatus: "Bad Request",
      message: "Lastname must be inputed",
    });
  });

  it("should return BAD_REQUEST if email is missing", async () => {
    delete req.body.email;

    await userSignupController(req, res);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      httpStatus: "Bad Request",
      message: "Email must be inputed",
    });
  });

  it("should return BAD_REQUEST if password is missing", async () => {
    delete req.body.password;

    await userSignupController(req, res);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      httpStatus: "Bad Request",
      message: "Password must be inputed",
    });
  });

  it("should inform client if user already exists", async () => {
    User.findOne = jest.fn().mockResolvedValue(req.body);

    await userSignupController(req, res);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      httpStatus: "Bad Request",
      message: "User already exists",
    });
  });

  it("should inform client when user succcessfully signs up", async () => {
    jest.spyOn(auth, "hashPassword").mockResolvedValue(req.body.password);
    User.findOne = jest.fn().mockResolvedValue(null);
    User.create = jest.fn().mockResolvedValue(req.body);

    await userSignupController(req, res);

    expect(User.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    expect(res.json).toHaveBeenCalledWith({
      httpStatus: "Created",
      message: "User created",
    });
  });

  it("should return INTERNAL_SERVER_ERROR if an error occurs", async () => {
    User.findOne = jest.fn().mockRejectedValue(new Error("Database error"));

    await userSignupController(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
    expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      httpStatus: "Internal server error",
      message: "An error occured when creating the user",
    });
  });
});
