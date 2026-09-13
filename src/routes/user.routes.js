import { Router } from "express";
const userRouter = Router();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import {
  signupSchema,
  signinSchema,
} from "../validation/user.validation.schema.js";

const JWT_SECRET = process.env.JWT_SECRET;

userRouter.post("/signup", async (req, res) => {
  try {
    const validationResult = signupSchema.safeParse(req.body);
    if (!validationResult.success) {
      const formattedErrors = validationResult.error?.issues.map((e) => {
        return { path: e.path[0], message: e.message };
      });
      res.status(422).json({
        success: false,
        message: "validation error",
        error: formattedErrors,
      });
      return;
    }
    const hashedPass = await bcrypt.hash(validationResult.data.password, 10);
    const newUser = await User.create({
      name: validationResult.data.name,
      email: validationResult.data.email,
      password: hashedPass,
    });
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET);
    res.cookie("token", token);
    res.status(201).json({
      success: true,
      message: "User signed up",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      console.log("Duplicate key error KEY: ", err.keyValue);
      res.status(409).json({
        success: false,
        message: "This email is already registered. Please log in instead.",
      });
      return;
    }
    console.log("Signup Error: ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
userRouter.post("/signin", async (req, res) => {
  try {
    const validationResult = signinSchema.safeParse(req.body);
    if (!validationResult.success) {
      const formattedErrors = validationResult.error.issues.map((e) => ({
        path: e.path[0],
        message: e.message,
      }));
      res.status(422).json({
        success: false,
        message: "Validation error",
        error: formattedErrors,
      });
      return;
    }

    const user = await User.findOne({ email: validationResult.data.email });
    if (!user) {
      res
        .status(404)
        .json({ success: false, message: "Wrong email or password" });
      return;
    }

    const compareRes = await bcrypt.compare(
      validationResult.data.password,
      user.password,
    );
    if (!compareRes) {
      res
        .status(400)
        .json({ success: false, message: "Wrong email or password" });
      return;
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.cookie("token", token);
    res.status(200).json({
      success: true,
      message: "User signed in",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.log("Signin Error: ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
userRouter.get("/logout", (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "User logged out" });
  } catch (err) {
    console.log("Logout error: ", err);
    res.send(500).json({ success: false, message: "Internal server error" });
  }
});

export default userRouter;
