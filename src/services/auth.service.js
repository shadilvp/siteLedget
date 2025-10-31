import Company from "../models/company.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

// Generate tokens
const generateAccessToken = (company) => {
  return jwt.sign(
    { id: company._id, name: company.name, email: company.email },
    process.env.JWT_SECRET,
    { expiresIn: "2d" }
  );
};

const generateRefreshToken = (company) => {
  return jwt.sign(
    { id: company._id, name: company.name },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

// Register
export const registerCompany = async ({ name, email, password }) => {
  const existing = await Company.findOne({ email });
  if (existing) throw new AppError("Email already registered", 400);

  const hashedPassword = await bcrypt.hash(password, 10);
  return await Company.create({ name, email, password: hashedPassword });
};

// Login
export const loginCompany = async ({ email, password }) => {
  const company = await Company.findOne({ email });
  if (!company) throw new AppError("Invalid credentials", 400);

  const validPassword = await bcrypt.compare(password, company.password);
  if (!validPassword) throw new AppError("Invalid credentials", 400);

  const accessToken = generateAccessToken(company);
  const refreshToken = generateRefreshToken(company);

  company.refreshToken = refreshToken;
  await company.save();

  return { company, accessToken, refreshToken };
};

// Refresh
export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) throw new AppError("No refresh token provided", 401);

  const company = await Company.findOne({ refreshToken });
  if (!company) throw new AppError("Invalid refresh token", 403);

  try {
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = generateAccessToken(company);
    return { newAccessToken };
  } catch (err) {
    throw new AppError("Expired refresh token", 403);
  }
};

// Logout
export const logoutCompany = async (refreshToken) => {
  const company = await Company.findOne({ refreshToken });
  if (company) {
    company.refreshToken = null;
    await company.save();
  }
};
