import { Router } from "express";
const userRouter = Router();
import bcrypt from "bcrypt";

import User from "../models/user.model.js";
import { signupSchema } from "../validation/user.validation.schema.js";

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

export default userRouter;
