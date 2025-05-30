import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(`${[req.method]} ${req.url} - ${err.message}`);

  if (err instanceof Error) {
    res.status(400).json({
      status: "Error",
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    status: "Error",
    message: "Internal Server Error",
  });
  return;
};
