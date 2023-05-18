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
exports.decode_token = exports.create_jwt_token = exports.verifyPassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const salt_factor = process.env.SALT_FACTOR;
const token_key = process.env.TOKEN_KEY;
const token_expiration = process.env.TOKEN_VALIDITY_DURATION;
function generateSalt() {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcrypt_1.default.genSalt(Number(salt_factor));
        return salt;
    });
}
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield generateSalt();
        const hashed_password = yield bcrypt_1.default.hash(password, salt);
        return hashed_password;
    });
}
exports.hashPassword = hashPassword;
function verifyPassword(password, userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const password_is_correct = bcrypt_1.default.compare(password, userPassword);
        return password_is_correct;
    });
}
exports.verifyPassword = verifyPassword;
function create_jwt_token(user_id, email) {
    const token = jsonwebtoken_1.default.sign({
        user_id,
        email,
    }, token_key, {
        expiresIn: token_expiration,
    });
    return token;
}
exports.create_jwt_token = create_jwt_token;
function decode_token(token) {
    try {
        if (typeof token === "string") {
            const decoded_token = jsonwebtoken_1.default.verify(token, token_key);
            const return_value = {
                valid: true,
                expired: false,
                decoded_token: decoded_token,
            };
            return return_value;
        }
    }
    catch (err) {
        const return_value = { valid: false, expired: true, decoded_token: null };
        return return_value;
    }
}
exports.decode_token = decode_token;
