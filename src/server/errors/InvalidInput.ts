import type { ApiError, ApiErrorInfo } from "./ApiError";

class InvalidInputError implements ApiError {
  constructor(details?: string) {
    if (details) this.message += `: \n ${details}`;
  }
  name = "InvalidInputError";
  message = "The request contains data in a format that cannot be processed";
  statusCode = 422;
  getFormattedError(): ApiErrorInfo {
    return {
      message: this.message,
      status: this.statusCode,
      isError: true,
      timestamp: new Date().toISOString(),
    };
  }
}

export default InvalidInputError;
