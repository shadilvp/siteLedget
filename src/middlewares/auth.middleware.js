import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

export const authMiddleware = (req, res, next) => {
  let token = null;

  // 1. First check cookies
  if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  // 2. Then check Authorization header
  else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Access denied. No token provided", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.company = decoded;
    next();
  } catch (err) {
    return next(new AppError("Invalid or expired token", 403));
  }
};
