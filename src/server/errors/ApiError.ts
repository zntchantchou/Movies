export type ApiErrorInfo = {
  message: string;
  status: number;
  isError: boolean;
  timestamp: string;
};

export interface ApiError extends Error {
  name: string;
  statusCode: number;
  message: string;
  getFormattedError(): ApiErrorInfo;
}
