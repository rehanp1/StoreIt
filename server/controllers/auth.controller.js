import { User } from "../models/user.model.js";
import { generateOTP } from "../utils/index.js";
import transporter from "../config/nodemailer.js";

export const signUp = async (req, res) => {
  try {
    const { fullName, email } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const { otp, expireAt } = generateOTP();

    await User.create({
      fullName,
      email,
      verifyOtp: otp,
      verifyOtpExpireAt: expireAt,
    });

    //send otp via nodemailer
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to StoreIt",
      text: `Welcome to StoreIt website. Your account has been created with email id: ${email}. Verify with this OTP: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, user: { fullName, email } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
    console.log(err);
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { otp, email } = req.body;
    const user = await User.findOne({ email });

    if (user.verifyOtpExpireAt < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "OTP is expired" });
    }

    if (user.verifyOtp !== otp) {
      return res
        .status(400)
        .json({ success: false, message: "OTP is invalid" });
    }

    const token = await user.generateToken();

    res.cookie("store_it_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 3 * 60 * 60 * 1000, // 3 hour
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const signInAndResendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const userExists = await User.findOne({ email });

    if (!userExists) {
      return res.status(400).json({
        success: false,
        message: "User is not exists with this email",
      });
    }

    const { otp, expireAt } = generateOTP();

    userExists.verifyOtp = otp;
    userExists.verifyOtpExpireAt = expireAt;
    const user = { fullName: userExists.fullName, email: userExists.email };
    await userExists.save();

    //send otp via nodemailer
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to StoreIt",
      text: `Welcome to StoreIt website. Your account has been created with email id: ${email}. Verify with this OTP: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie("store_it_session", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    const { id, fullName, email } = req.user;
    res.status(200).json({ success: true, user: { id, fullName, email } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
