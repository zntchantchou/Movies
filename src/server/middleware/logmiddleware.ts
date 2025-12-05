import type { NextFunction, Request, Response } from "express";
import Logger from "../../utils/Logger.ts";

async function logMiddelware(req: Request, res: Response, next: NextFunction) {
  Logger.log(req);
  next();
}

export default logMiddelware;
