export const bad_request = (message: string) => {
  return {
    httpStatus: "Bad Request",
    message: message,
  };
};

export const created = (message: string) => {
  return {
    httpStatus: "Created",
    message: message,
  };
};

export const internal_server_error = (message: string) => {
  return {
    httpStatus: "Internal server error",
    message: message,
  };
};

export const not_found = (message: string) => {
  return {
    httpStatus: "Not found",
    message: message,
  };
};

export const Ok = (message: unknown) => {
  return {
    httpStatus: "Ok",
    message: message,
  };
};

export const unauthorized = (message: string) => {
  return {
    httpStatus: "Unauthorized",
    message: message,
  };
};
