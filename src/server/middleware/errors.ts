import type { NextFunction, Request, Response } from "express";
import type { ApiError } from "../errors/ApiError.ts";
import InternalServerError from "../errors/InternalError.ts";

export async function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  nextFn: NextFunction
) {
  if (isApiError(err)) {
    // log error using getFormattedError and log to error log
    return res.status(err.statusCode).json(err.getFormattedError());
  }
  // Try to extract a cause or message from the error and log it to error log
  const error = new InternalServerError();
  return res.status(error.statusCode).json(error.getFormattedError());
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isApiError(error: any): error is ApiError {
  return (
    typeof error?.getFormattedError === "function" &&
    typeof error.statusCode === "number"
  );
}
