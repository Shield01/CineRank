"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unauthorized = exports.Ok = exports.not_found = exports.internal_server_error = exports.created = exports.bad_request = void 0;
const bad_request = (message) => {
    return {
        httpStatus: "Bad Request",
        message: message,
    };
};
exports.bad_request = bad_request;
const created = (message) => {
    return {
        httpStatus: "Created",
        message: message,
    };
};
exports.created = created;
const internal_server_error = (message) => {
    return {
        httpStatus: "Internal server error",
        message: message,
    };
};
exports.internal_server_error = internal_server_error;
const not_found = (message) => {
    return {
        httpStatus: "Not found",
        message: message,
    };
};
exports.not_found = not_found;
const Ok = (message) => {
    return {
        httpStatus: "Ok",
        message: message,
    };
};
exports.Ok = Ok;
const unauthorized = (message) => {
    return {
        httpStatus: "Unauthorized",
        message: message,
    };
};
exports.unauthorized = unauthorized;
