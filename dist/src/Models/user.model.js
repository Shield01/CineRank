"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserSchema = new mongoose_1.Schema({
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
            movie_id: { type: mongoose_1.Schema.Types.ObjectId, ref: "Movie" },
            rank: { type: Number },
        },
    ],
}, {
    timestamps: true,
});
UserSchema.methods.comparePassword = function (candidatePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        return bcrypt_1.default.compare(candidatePassword, user.password).catch((e) => false);
    });
};
const User = (0, mongoose_1.model)("User", UserSchema);
exports.default = User;
