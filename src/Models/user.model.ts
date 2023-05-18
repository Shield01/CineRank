import { model, Document, Schema } from "mongoose";
import { top100List } from "../Utils/types.utils";
import bcrypt from "bcrypt";

export interface UserDocument extends Document {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  movie_list: Array<top100List>;
}

const UserSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: {
      type: String,
      required: [true, "Please enter a valid email address"],
      unique: [true, "Email Address already exists"],
    },
    password: { type: String, required: [true, "Password is required"] },
    movie_list: [
      {
        movie_id: { type: Schema.Types.ObjectId, ref: "Movie" },
        rank: { type: Number },
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const user = this as UserDocument;
  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

const User = model<UserDocument>("User", UserSchema);

export default User;
