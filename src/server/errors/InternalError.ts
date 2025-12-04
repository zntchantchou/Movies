import type { ApiError, ApiErrorInfo } from "./ApiError";

class InternalServerError implements ApiError {
  constructor(details?: string) {
    if (details) this.message += `: \n ${details}`;
  }
  name = "InternalServerError";
  message = "An error has occured";
  statusCode = 500;
  getFormattedError(): ApiErrorInfo {
    return {
      message: this.message,
      status: this.statusCode,
      isError: true,
      timestamp: new Date().toISOString(),
    };
  }
}

export default InternalServerError;
