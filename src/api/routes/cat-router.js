import express from "express";
import {
  getCat,
  getCatById,
  postCat,
  putCat,
  deleteCat,
} from "../controllers/cat-controller.js";
import multer from "multer";
import { createThumbnail } from "../../middlewares.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const suffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const prefix = file.filename;
    let extension = "jpg";
    if (file.mimetype === "image/png") {
      extension = png;
    }
    if (file.mimetype === "image/jpeg") {
      extension = jpeg;
    }
    const filename = `${prefix} - ${suffix}.${extension}`;
    cb(null, filename);
  },
});

const upload = multer({
  destination: "uploads/",
  storage,
});

const catRouter = express.Router();

catRouter
  .route("/")
  .get(getCat)
  .post(upload.single("file"), createThumbnail, postCat);

catRouter.route("/:id").get(getCatById).put(putCat).delete(deleteCat);

export default catRouter;
