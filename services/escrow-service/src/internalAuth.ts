import { Request, Response, NextFunction } from "express";

export function verifyInternalAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.headers["x-internal-token"] !== process.env.INTERNAL_SERVICE_TOKEN) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}
