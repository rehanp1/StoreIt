import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import {
  uploadFile,
  renameFile,
  deleteFile,
  shareFile,
  getFiles,
  searchFile,
  unshareFile,
  totalSpaceUsed,
} from "../controllers/file.controller.js";
import authenticateToken from "../middlewares/userAuth.middleware.js";

const fileRouter = Router();

fileRouter
  .route("/upload")
  .post(authenticateToken, upload.array("files", 10), uploadFile);

fileRouter.route("/rename").put(authenticateToken, renameFile);
fileRouter.route("/delete").put(authenticateToken, deleteFile);
fileRouter.route("/share").put(authenticateToken, shareFile);
fileRouter.route("/unshare").put(authenticateToken, unshareFile);
fileRouter.route("/get-files").put(authenticateToken, getFiles);
fileRouter.route("/search-file").post(authenticateToken, searchFile);
fileRouter.route("/get-totalspaceused").get(authenticateToken, totalSpaceUsed);

export default fileRouter;
