import type { ApiError, ApiErrorInfo } from "./ApiError";

class InvalidOriginError implements ApiError {
  constructor(details?: string) {
    if (details) this.message += `: \n ${details}`;
  }
  name = "InvalidOriginError";
  message = "Cannot accept request";
  statusCode = 403;
  getFormattedError(): ApiErrorInfo {
    return {
      message: this.message,
      status: this.statusCode,
      isError: true,
      timestamp: new Date().toISOString(),
    };
  }
}

export default InvalidOriginError;
