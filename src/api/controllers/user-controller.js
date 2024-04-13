import {
  addUser,
  findUserById,
  listAllUsers,
  updateUser,
  removeUser,
  getCatsById,
} from "../models/user-model.js";
import bcrypt from "bcrypt";

const getUsers = async (req, res) => {
  res.json(await listAllUsers());
};

const getUserById = async (req, res) => {
  const user = await findUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
};

const addNewUser = async (req, res, next) => {
  console.log(req.body);
  req.body.password = bcrypt.hashSync(req.body.password, 10);
  const result = await addUser(req.body);
  if (!result) {
    const error = new Error("Invalid or missing fields");
    error.status = 400;
    next(error);
  } else {
    res.status(201).json({ message: "New user added: ", result });
  }
};

const putUser = async (req, res, next) => {
  const result = await updateUser(req.body, req.params.id, res.locals.user);
  if (!result) {
    const error = new Error("Invalid values.");
    error.status = 400;
    next(error);
  } else
    res.status(200).json({ message: "User modification succeeded.", result });
};

const deleteUser = async (req, res) => {
  const result = await removeUser(req.params.id, res.locals.user);
  console.log(result);
  if (result) {
    res.status(200).json({ message: "User removed successfully", result });
  } else {
    res.sendStatus(400);
  }
};

const getCatsByUserid = async (req, res) => {
  const result = await getCatsById(req.params.id);
  console.log(result);
  if (result) res.status(200).json({ message: "Got all cats", result });
  else res.sendStatus(400);
};

export {
  getUsers,
  getUserById,
  addNewUser,
  putUser,
  deleteUser,
  getCatsByUserid,
};
