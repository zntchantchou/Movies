import type { NextFunction, Request, Response } from "express";
import type { ApiError } from "../errors/ApiError.ts";
import InternalServerError from "../errors/InternalError.ts";
import ErrorLogger from "../ErrorLogger.ts";

export async function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  nextFn: NextFunction
) {
  let error;
  if (!isApiError(err)) error = new InternalServerError();
  else {
    error = err;
  }
  ErrorLogger.log(req, error);
  return res.status(error.statusCode).json(error.getFormattedError());
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isApiError(error: any): error is ApiError {
  return (
    typeof error?.getFormattedError === "function" &&
    typeof error.statusCode === "number"
  );
}
