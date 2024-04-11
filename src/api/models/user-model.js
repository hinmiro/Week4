"use strict";

import promisePool from "../../utils/database.js";

const listAllUsers = async () => {
  const [rows] = await promisePool.query("SELECT * FROM wsk_users");
  return rows;
};

const findUserById = async (id) => {
  const [rows] = await promisePool.query(
    "SELECT * FROM wsk_users WHERE user_id = ?",
    [id],
  );
  if (rows.length === 0) return false;
  return rows[0];
};

const addUser = async (user) => {
  const { name, username, email, role, password } = user;
  const sql =
    "INSERT INTO wsk_users (name, username, email, role, password) VALUES (?, ?, ?, ?, ?)";
  const params = [name, username, email, password, role].map((value) => {
    if (value === undefined) return null;
    else return value;
  });
  const rows = await promisePool.execute(sql, params);
  if (rows[0].affectedRows === 0) return false;
  return { message: "Success" };
};

const updateUser = (id, field, value) => {
  const user = findUserById(id);
  console.log(user);
  switch (field) {
    case "name":
      user.name = value;
      break;
    case "username":
      user.username = value;
      break;
    case "email":
      user.email = value;
      break;
    case "role":
      user.role = value;
      break;
    case "password":
      user.password = value;
      break;
    default:
      console.log("I am teapot!");
      break;
  }
  console.log(user);
  return user;
};

export { listAllUsers, addUser, findUserById, updateUser };
