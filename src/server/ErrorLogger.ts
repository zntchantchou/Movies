import type { Request } from "express";
import { join } from "path";
import pino, { transport } from "pino";
import type { ApiError } from "./errors/ApiError";

const defaultLogContent = { timeStamp: new Date().toISOString() };
const errorFileTransport = transport({
  target: "pino-roll",
  level: "error",
  options: {
    file: `${join("logs", "errors")}`,
    frequency: "daily",
    mkdir: true,
    dateFormat: "yyyy-MM-dd",
  },
});

class ErrorLogger {
  private logger = pino(errorFileTransport);

  log(req: Request, error: ApiError) {
    this.logger.error({
      ...defaultLogContent,
      url: req.originalUrl,
      userAgent: req.headers["user-agent"],
      origin: req.headers["origin"],
      ip: req.ip,
      errorType: error.name,
      status: error.statusCode,
    });
  }
}

export default new ErrorLogger();
