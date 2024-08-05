import { RequestHandler } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import UserModel from "../models/users";
import sendCookie from "../utils/saveCookie";
import jwt from "jsonwebtoken";
import env from "../utils/validateEnv";
import { validateUser } from "../utils/validateUser";
import mongoose from "mongoose";

export interface signUpBody {
  username: string;
  email: string;
  password: string;
}
export const signUp: RequestHandler<unknown, unknown, signUpBody> = async (
  req,
  res,
  next
) => {
  const { username, email, password } = req.body;
  try {
    const { error } = validateUser(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const existingUser = await UserModel.findOne()
      .or([{ username: username }, { email: email }])
      .exec();
    if (existingUser)
      return res.status(409).json({ message: "User already exist" });

    const passwordHashed = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      username,
      email,
      password: passwordHashed,
    });
    sendCookie(newUser._id, res);

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (er) {
    next(er);
  }
};

interface loginBody {
  username: string;
  password: string;
}
export const login: RequestHandler<unknown, unknown, loginBody> = async (
  req,
  res,
  next
) => {
  const { username, password } = req.body;
  try {
    if (!username || !password)
      throw createHttpError(404, "Parameters not provided");

    const user = await UserModel.findOne({ username })
      .select("+password +email")
      .exec();
    if (!user) throw createHttpError(401, "Invalid credentials");

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw createHttpError(401, "Invalid credentials");

    sendCookie(user._id, res);
    res.status(200).json({ message: "Login successful", user });
  } catch (er) {
    next(er);
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  res.clearCookie("token").json({ message: "Logged out successfully" });
};

export const getLoggedInUser: RequestHandler = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) throw createHttpError(401, "Unauthorized: No token provided");
    const decoded = jwt.verify(token, env.JWT_SECRET!) as {
      userId: mongoose.Types.ObjectId;
    };
    const user = await UserModel.findById(decoded.userId).exec();
    if (!user) throw createHttpError(404, "User not found");

    res.status(200).json({ user });
  } catch (er) {
    next(er);
  }
};
