import { Request, Response, NextFunction } from "express";

export function verifyInternalAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers["x-internal-token"];

  if (token !== process.env.INTERNAL_SERVICE_TOKEN) {
    return res.status(401).json({
      message: "Unauthorized internal request"
    });
  }

  next();
}
