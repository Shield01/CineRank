import { Request, Response } from "express";
import {
  bad_request,
  not_found,
  Ok,
  unauthorized,
  internal_server_error,
} from "../Utils/http_responses.utils";
import { StatusCodes } from "http-status-codes";
import User from "../Models/user.model";
import { verifyPassword, create_jwt_token } from "../Utils/auth.utils";

export async function Login(req: Request, res: Response) {
  //Destructure the Request Object

  const {
    body: { email, password },
  } = req;

  // Confirm that all required data are passed in the request body

  if (!email) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(bad_request("Kindly input your email"));
  }

  if (!password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(bad_request("Kindly input your password"));
  }

  //Confirm that the user exists,
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(not_found("User not found"));
    } else {
      // Verify the password provided
      const password_is_verified = await verifyPassword(
        password,
        user.password
      );

      if (password_is_verified) {
        const token = await create_jwt_token(user._id, user.email);

        return res.status(StatusCodes.OK).json(Ok(token));
      } else {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json(unauthorized("Incorrect password"));
      }
    }
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        internal_server_error("An error occured while user was logging in")
      );
  }
}
