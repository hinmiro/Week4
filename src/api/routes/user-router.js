import express from "express";
import {
  getUsers,
  getUserById,
  addNewUser,
  putUser,
  deleteUser,
  getCatsByUserid,
} from "../controllers/user-controller.js";
import { authenticateToken } from "../../middlewares.js";

const userRouter = express.Router();

userRouter.route("/").get(getUsers).post(addNewUser);

userRouter
  .route("/:id")
  .get(getUserById)
  .delete(authenticateToken, deleteUser)
  .put(authenticateToken, putUser);

userRouter.route("/getCats/:id").get(getCatsByUserid);

export default userRouter;
