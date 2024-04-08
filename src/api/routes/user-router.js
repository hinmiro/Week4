import express from "express";
import {
  getUsers,
  getUserById,
  addNewUser,
  putUser,
  deleteUser,
} from "../controllers/user-controller.js";

const userRouter = express.Router();

userRouter.route("/").get(getUsers).post(addNewUser);

userRouter.route("/:id").get(getUserById).delete(deleteUser).put(putUser);

export default userRouter;
