import express from "express";
const app = express();
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.routes.js";
import { contactRouter } from "./routes/contact.routes.js";

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/contact", contactRouter);

export default app;
