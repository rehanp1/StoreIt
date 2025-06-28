import { Types } from "mongoose";
import { File } from "../models/file.model.js";
import { getFileType, uploadOnCloudinary } from "../utils/index.js";

export const getFiles = async (req, res) => {
  try {
    const { fileType } = req.query;
    const { user } = req;

    const fileTypeArray = fileType.split(",");

    if (!fileType || fileType.length === 0)
      return res
        .status(400)
        .json({ success: false, message: "File Type is required" });

    const results = await File.find({
      $or: [
        { "owner.id": user.id, type: { $in: fileTypeArray } },
        { sharedWith: { $in: user.email }, type: { $in: fileTypeArray } },
      ],
    });

    res.status(200).json({ success: true, results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const uploadFile = async (req, res) => {
  try {
    const { files, user } = req;
    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    const results = await Promise.all(
      files.map((file) => uploadOnCloudinary(file.path))
    );

    // storing in mongoDB database
    const storedMetadata = await Promise.all(
      results.map(async (result) => {
        const metadata = {
          type: getFileType(result.original_filename + "." + result.format)
            .type,
          name: result.original_filename,
          url: result.secure_url,
          extension: getFileType(result.original_filename + "." + result.format)
            .extension,
          size: result.bytes,
          owner: { id: user.id, fullName: user.fullName, email: user.email },
          sharedWith: [],
          cloudinary_asset_id: result.asset_id,
        };

        const savedFile = await File.create(metadata);
        return savedFile;
      })
    );

    res.status(200).json({
      success: true,
      results: storedMetadata,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const renameFile = async (req, res) => {
  try {
    const { ownerId, fileId, newFileName } = req.body;
    const { user } = req;

    if (user.id !== ownerId) {
      return res
        .status(401)
        .json({ success: false, message: "Only Admin can rename the file" });
    }

    const fileExists = await File.findById(fileId);

    if (!fileExists) {
      return res
        .status(404)
        .json({ success: false, message: "File Not Found" });
    }

    fileExists.name = newFileName;
    await fileExists.save();

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { user } = req;
    const { fileId, owner } = req.body;

    if (user.id === owner.id) {
      await File.findByIdAndDelete(fileId);
      return res.status(200).json({ success: true });
    }

    const updatedFile = await File.findByIdAndUpdate(
      fileId,
      { $pull: { sharedWith: user.email } },
      { new: true }
    );

    if (!updatedFile) {
      return res
        .status(404)
        .json({ success: false, message: "File Not Found" });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const shareFile = async (req, res) => {
  try {
    const { user } = req;
    const { fileId, ownerId, shareEmails } = req.body;

    if (user.id !== ownerId) {
      return res
        .status(401)
        .json({ success: false, message: "Only Admin can share the file" });
    }

    if (!shareEmails || shareEmails.length == 0) {
      return res
        .status(401)
        .json({ success: false, message: "Shared Email not provided" });
    }

    const file = await File.findById(fileId);

    const filterEmails = shareEmails.filter(
      (email) => !file.sharedWith.includes(email) && email !== ""
    );

    filterEmails.forEach((email) => {
      file.sharedWith.push(email);
    });

    await file.save();

    res.status(200).json({ success: true, results: file });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const unshareFile = async (req, res) => {
  try {
    const { user } = req;
    const { fileId, ownerId, removeEmail } = req.body;

    if (user.id !== ownerId) {
      return res
        .status(401)
        .json({ success: false, message: "Only Admin can share the file" });
    }

    if (!removeEmail) {
      return res
        .status(401)
        .json({ success: false, message: "Email is not provided" });
    }

    const file = await File.findById(fileId);

    file.sharedWith = file.sharedWith.filter((e) => e !== removeEmail);

    await file.save();

    res.status(200).json({ success: true, results: file });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const searchFile = async (req, res) => {
  try {
    const { user } = req;
    const { query } = req.query;
    if (!query || query === "")
      res
        .status(400)
        .json({ success: false, message: "Search query is not provided" });

    const results = await File.find({
      name: { $regex: `.*${query}.*`, $options: "i" },
      $or: [{ "owner.id": user.id }, { sharedWith: { $in: user.email } }],
    });

    res.status(200).json({ success: true, results: results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const totalSpaceUsed = async (req, res) => {
  try {
    const { user } = req;

    const [filesGroupByType, recentUploadFiles] = await Promise.all([
      File.aggregate([
        {
          $match: { "owner.id": new Types.ObjectId(user.id) },
        },
        {
          $group: {
            _id: "$type",
            size: { $sum: "$size" },
            latestDate: { $max: "$updatedAt" },
          },
        },
      ]),

      File.find({ "owner.id": user.id }).sort({ createdAt: -1 }).limit(10),
    ]);

    let totalSpace = { used: 0, all: 500 * 1024 * 1024 }; //500MB space allotted

    filesGroupByType.forEach((d) => {
      totalSpace[d._id] = { size: d.size, latestDate: d.latestDate };
      totalSpace.used += d.size;
    });

    res.status(200).json({
      success: true,
      results: { totalSpace, recentUploadFiles },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
