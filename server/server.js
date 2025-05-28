import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./db/index.js";
import authRouter from "./routes/auth.routes.js";
import fileRouter from "./routes/file.routes.js";

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Frontend URL
    credentials: true, // Allow cookies to be sent
  })
);
app.use(express.json());

//Auth router
app.use("/api/auth", authRouter);
app.use("/api/file", fileRouter);

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`App running on ${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection FAILED: ", err);
  });
