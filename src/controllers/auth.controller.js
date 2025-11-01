import {
  registerCompany,
  loginCompany,
  refreshAccessToken,
  logoutCompany,
} from "../services/auth.service.js";
import AppError from "../utils/AppError.js";
import { validateRegister, validateLogin } from "../models/company.model.js";

// Register
export const register = async (req, res, next) => {
  try {
    const { error } = validateRegister(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    const company = await registerCompany(req.body);
    res.status(201).json({ message: "Company registered", id: company._id });
  } catch (err) {
    next(err);
  }
};

// Login
export const login = async (req, res, next) => {
  console.log("Login request received");
  try {
    const { error } = validateLogin(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    const { company, accessToken, refreshToken } = await loginCompany(req.body);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000, 
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.json({
      message: "Login successful",
      companyId: company._id,
      name: company.name,
      status: company.status,
      accessToken,  
      refreshToken 
    });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    const { newAccessToken } = await refreshAccessToken(token);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Access token refreshed" });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    await logoutCompany(req.cookies.refreshToken);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};
