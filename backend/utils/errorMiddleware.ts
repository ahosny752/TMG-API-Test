import { Request, Response, NextFunction } from "express";

//middleware to handle errors
export default (err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Something went wrong!" });
};
