import type { Request } from "express";
import { join } from "path";
import pino from "pino";
import type { ApiError } from "../server/errors/ApiError.ts";
import InternalServerError from "../server/errors/InternalError.ts";

class Logger {
  private defaultLogContent = { timeStamp: new Date().toISOString() };
  private formatRequestInfo(req: Request) {
    return {
      ...this.defaultLogContent,
      url: req.originalUrl,
      userAgent: req.headers["user-agent"],
      origin: req.headers["origin"],
      ip: req.ip,
    };
  }

  private logger = pino({
    transport: {
      targets: [
        {
          target: "pino-pretty",
          options: { colorize: true },
          level: "info",
        },
        {
          target: "pino-roll",
          level: "error",
          options: {
            destination: "logs/app.log",
            file: `${join("logs", process.env.NODE_ENV === "test" ? "test" : "error")}`,
            frequency: "daily",
            mkdir: true,
            dateFormat: "yyyy-MM-dd",
          },
        },
      ],
    },
  });

  log(req: Request) {
    this.logger.info(this.formatRequestInfo(req));
  }

  logApiError(req: Request, error: ApiError) {
    this.logger.error({
      errorType: error.name,
      status: error.statusCode,
      msg: error.message,
      ...this.formatRequestInfo(req),
    });
  }

  /**
   * Logs an error with their stack and cause if those exist
   * @param error
   */
  error(error: Error) {
    const formattedError: { cause?: unknown; stack?: string } = {};
    if (error.cause) formattedError.cause = error.cause;
    if (error.stack) formattedError.stack = error.stack;
    this.logger.error({
      ...new InternalServerError().getFormattedError(),
      ...formattedError,
    });
  }

  info(msg: string) {
    this.logger.info(msg);
  }
}

export default new Logger();
