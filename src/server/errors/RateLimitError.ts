import type { ApiError, ApiErrorInfo } from "./ApiError";

class RateLimitError implements ApiError {
  constructor(details?: string) {
    if (details) this.message += `: \n ${details}`;
  }
  name = "RateLimitError";
  message = "Too many requests";
  statusCode = 429;
  getFormattedError(): ApiErrorInfo {
    return {
      message: this.message,
      status: this.statusCode,
      isError: true,
      timestamp: new Date().toISOString(),
    };
  }
}

export default RateLimitError;
