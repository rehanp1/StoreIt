import mongoose, { Schema } from "mongoose";

const fileSchema = new Schema(
  {
    type: String,
    name: String,
    url: String,
    extension: String,
    size: Number,
    owner: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      fullName: String,
      email: String,
    },
    sharedWith: [String],
    cloudinary_asset_id: String,
  },
  {
    timestamps: true,
  }
);

export const File = mongoose.model("File", fileSchema);
