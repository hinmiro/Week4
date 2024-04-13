import express from "express";
import {
  getUsers,
  getUserById,
  addNewUser,
  putUser,
  deleteUser,
  getCatsByUserid,
} from "../controllers/user-controller.js";
import { authenticateToken, validationErrors } from "../../middlewares.js";
import { body, param } from "express-validator";
import { updateUser } from "../models/user-model.js";

const userRouter = express.Router();

userRouter
  .route("/")
  .get(getUsers)
  .post(
    body("name").isLength({ min: 1, max: 25 }),
    body("email").trim().isEmail(),
    body("username").trim().isLength({ min: 3, max: 20 }),
    body("password").trim().isLength({ min: 6 }),
    validationErrors,
    addNewUser,
  );

userRouter
  .route("/:id")
  .get(param("id").isNumeric(), validationErrors, getUserById)
  .delete(
    authenticateToken,
    param("id").isNumeric(),
    validationErrors,
    deleteUser,
  )
  .put(
    authenticateToken,
    param("id").isNumeric().optional(),
    body("email").trim().isEmail().optional(),
    body("username").trim().isLength({ min: 3, max: 20 }).optional(),
    body("password").trim().isLength({ min: 6 }).optional(),
    body("role").trim().optional(),
    validationErrors,
    putUser,
  );

userRouter
  .route("/getCats/:id")
  .get(param("id").isNumeric(), validationErrors, getCatsByUserid);

export default userRouter;
