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
import { body } from "express-validator";

const userRouter = express.Router();

userRouter
  .route("/")
  .get(getUsers)
  .post(
    body("email").trim().isEmail(),
    body("username").trim().isLength({ min: 3, max: 20 }),
    body("password").trim().isLength({ min: 8 }),
    validationErrors,
    addNewUser,
  );

userRouter
  .route("/:id")
  .get(getUserById)
  .delete(deleteUser)
  .put(authenticateToken, putUser);

userRouter.route("/getCats/:id").get(getCatsByUserid);

export default userRouter;
