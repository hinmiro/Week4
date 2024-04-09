import {
  addUser,
  findUserById,
  listAllUsers,
  updateUser,
} from "../models/user-model.js";

const getUsers = (req, res) => {
  res.json(listAllUsers());
};

const getUserById = (req, res) => {
  const user = findUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
};

const addNewUser = (req, res) => {
  const result = addUser(req.body);
  if (result.user_id) {
    res.status(201);
    res.json({ message: "New user added: ", result });
  } else {
    res.sendStatus(400);
  }
};

const putUser = (req, res) => {
  updateUser(req.body);
  res.status(200).json({ message: "User item updated." });
};

const deleteUser = (req, res) => {
  res.status(200).json({ message: "User item deleted." });
};

export { getUsers, getUserById, addNewUser, putUser, deleteUser };
