import { Router } from "express";
import {
  signUp,
  signInAndResendOtp,
  verifyOTP,
  signOut,
  isAuthenticated,
} from "../controllers/auth.controller.js";
import authenticateToken from "../middlewares/userAuth.middleware.js";

const authRouter = Router();

authRouter.route("/sign-up").post(signUp);
authRouter.route("/sign-in").post(signInAndResendOtp);
authRouter.route("/verify-otp").post(verifyOTP);
authRouter.route("/resend-otp").post(signInAndResendOtp);
authRouter.route("/sign-out").post(signOut);
authRouter.route("/is-auth").post(authenticateToken, isAuthenticated);

export default authRouter;
