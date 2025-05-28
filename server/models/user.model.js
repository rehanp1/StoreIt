import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    fullName: String,
    email: String,
    verifyOtp: {
      type: String,
      default: "",
    },
    verifyOtpExpireAt: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateToken = async function () {
  try {
    return jwt.sign(
      {
        id: this._id,
        fullName: this.fullName,
        email: this.email,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "15d",
      }
    );
  } catch (error) {
    console.log("TOKEN generate FAILED: ", error);
  }
};

export const User = mongoose.model("User", userSchema);
