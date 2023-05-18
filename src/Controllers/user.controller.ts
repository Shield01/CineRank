import User from "../Models/user.model";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import {
  bad_request,
  created,
  internal_server_error,
} from "../Utils/http_responses.utils";
import { hashPassword } from "../Utils/auth.utils";

export async function userSignupController(req: Request, res: Response) {
  const {
    body: { first_name, last_name, email, password },
  } = req;

  //Confirm that the required data is sent in the request

  if (!first_name) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(bad_request("Firstname must be inputed"));
  }

  if (!last_name) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(bad_request("Lastname must be inputed"));
  }

  if (!email) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(bad_request("Email must be inputed"));
  }

  if (!password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(bad_request("Password must be inputed"));
  }
  try {
    // Check if the user already exists, else create the user
    const user_exists = await User.findOne({ email });

    // If user exists, inform the client
    if (user_exists) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(bad_request("User already exists"));
    } else {
      //Compute hashed password
      const hashed_password = await hashPassword(password);

      //Create the user on the database
      await User.create({
        first_name,
        last_name,
        email,
        password: hashed_password,
      });

      // return successful response to the client
      return res.status(StatusCodes.CREATED).json(created("User created"));
    }
  } catch (err) {
    /*If an error occurs in the try block above, log the error to the console, and send a response 
      to the client*/
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internal_server_error("An error occured when creating the user"));
  }
}
