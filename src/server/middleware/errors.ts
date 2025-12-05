import type { NextFunction, Request, Response } from "express";
import type { ApiError } from "../errors/ApiError.ts";
import InternalServerError from "../errors/InternalError.ts";
import Logger from "../../utils/Logger.ts";
// import ErrorLogger from "../../utils/ErrorLogger.ts";

export async function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  nextFn: NextFunction
) {
  if (isApiError(err)) {
    Logger.logApiError(req, err);
    return res.status(err.statusCode).json(err.getFormattedError());
  }
  Logger.error(err);
  const genericError = new InternalServerError();
  return res
    .status(genericError.statusCode)
    .json(genericError.getFormattedError());
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isApiError(error: any): error is ApiError {
  return (
    typeof error?.getFormattedError === "function" &&
    typeof error.statusCode === "number"
  );
}
