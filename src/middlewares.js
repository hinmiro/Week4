import sharp from "sharp";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { validationResult } from "express-validator";
import * as fs from "node:fs";

const createThumbnail = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }
  const [filename, extension] = req.file.filename.split(".");

  await sharp(req.file.path)
    .resize(160, 160)
    .png()
    .toFile(`${req.file.destination}/${filename}_thumb.${extension}`);

  next();
};

const authenticateToken = (req, res, next) => {
  console.log("authenticateToken", req.headers);
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log("token", token);
  if (token == null) {
    return res.sendStatus(401);
  }
  try {
    res.locals.user = jwt.verify(token, process.env.SECRETKEY);
    next();
  } catch (err) {
    res.status(403).send({ message: "invalid token" });
  }
};

const notFoundHandler = (req, res, next) => {
  console.log("req:", req);
  const error = new Error(`Resource not found: ${req.originalUrl}`);
  error.status = 404;

  next(error);
};

const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message + ", IMA TEAPOT!",
      status: res.status || 500,
    },
  });
};

const validationErrors = async (req, res, next) => {
  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    //if (req.file.path) fs.unlinkSync(req.file.path);
    const messages = errors
      .array()
      .map((error) => `${error.path}: ${error.msg}`)
      .join(", ");
    const error = new Error(messages);
    error.status = 400;
    next(error);
  }
  next();
};

export {
  createThumbnail,
  authenticateToken,
  notFoundHandler,
  errorHandler,
  validationErrors,
};
