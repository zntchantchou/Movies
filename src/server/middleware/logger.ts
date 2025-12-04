import type { NextFunction, Request, Response } from "express";

async function logMiddelware(req: Request, res: Response, next: NextFunction) {
  next();
}

export default logMiddelware;
