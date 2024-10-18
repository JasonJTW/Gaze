import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserPayload } from "./types/express";

const jwtSecretAccessToken = process.env.JWT_ACCESS_TOKEN_SECRET as string;

function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.header("auth-token");
  if (!token) {
    console.log(`Access denied, No token`);
    return res.status(401).json({ message: "Access Denied, please signin" });
  }

  try {
    const verified = jwt.verify(token, jwtSecretAccessToken) as UserPayload;
    req.user = verified;
    console.log("verified: ", verified);
    next();
  } catch (err) {
    const error = err as Error;
    console.log(`Invalid token: ${error.message}`);
    res.status(400).json({ message: "Invalid token" });
  }
}

export default verifyToken;
