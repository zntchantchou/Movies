import type { ApiError, ApiErrorInfo } from "./ApiError";

class NotFoundError implements ApiError {
  constructor(details?: string) {
    if (details) this.message += `: \n ${details}`;
  }
  name = "NotFoundError";
  message = "The requested resource could not be found";
  statusCode = 404;
  getFormattedError(): ApiErrorInfo {
    return {
      message: this.message,
      status: this.statusCode,
      isError: true,
      timestamp: new Date().toISOString(),
    };
  }
}

export default NotFoundError;
