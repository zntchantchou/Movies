import type { NextFunction, Request, Response } from "express";

export async function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("[Error Middleware]:", Date.now());
  console.log("[Error Middleware] error: ", err);
  console.log("[Error Middleware] req.headersSent : ", res.headersSent);
  return res.status(500).send("[errorMiddleware] response");
}
