import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import "dotenv/config";
import { json } from "express";

const salt_factor: Number = process.env.SALT_FACTOR as unknown as Number;
const token_key = process.env.TOKEN_KEY as unknown as Secret;
const token_expiration = process.env.TOKEN_VALIDITY_DURATION;

async function generateSalt(): Promise<string | number> {
  const salt = await bcrypt.genSalt(Number(salt_factor));

  return salt;
}

export async function hashPassword(password: string): Promise<String> {
  const salt = await generateSalt();

  const hashed_password = await bcrypt.hash(password, salt);

  return hashed_password;
}

export async function verifyPassword(
  password: string,
  userPassword: string
): Promise<boolean> {
  const password_is_correct = bcrypt.compare(password, userPassword);

  return password_is_correct;
}

export function create_jwt_token(user_id: string, email: string): string {
  const token = jwt.sign(
    {
      user_id,
      email,
    },
    token_key,
    {
      expiresIn: token_expiration,
    }
  );

  return token;
}

export function decode_token(token: unknown) {
  try {
    if (typeof token === "string") {
      const decoded_token = jwt.verify(token, token_key);
      const return_value = {
        valid: true,
        expired: false,
        decoded_token: decoded_token,
      };
      return return_value;
    }
  } catch (err) {
    const return_value = { valid: false, expired: true, decoded_token: null };
    return return_value;
  }
}
