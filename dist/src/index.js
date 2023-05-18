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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const connectDb_1 = __importDefault(require("./db/connectDb"));
const app_1 = __importDefault(require("./app"));
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connectDb_1.default)();
        app_1.default.listen(PORT, () => {
            console.log(`App is running at PORT : ${PORT}`);
        });
    }
    catch (err) {
        console.log(`Error occured when starting the app : ${err}`);
    }
});
start();
