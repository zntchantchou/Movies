import type { Request, Response } from "express";
import RateLimitError from "../errors/RateLimitError.ts";
import Logger from "../../utils/Logger.ts";

export default function rateLimitHandler(req: Request, res: Response) {
  const error = new RateLimitError();
  Logger.logApiError(req, error);
  return res.status(error.statusCode).send(error.message);
}
