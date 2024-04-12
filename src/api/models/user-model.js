"use strict";
import promisePool from "../../utils/database.js";
import crypto from "crypto";
import "dotenv/config";

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

  console.log("rows: ", rows);
  return rows[0];
};

const addUser = async (user) => {
  const { name, username, email, password, role } = user;
  const params = [name, username, email, password, role];
  if (params.some((p) => p === null || p === undefined)) {
    return false;
  }
  const sql =
    "INSERT INTO wsk_users (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)";

  const rows = await promisePool.execute(sql, params);
  if (rows[0].affectedRows === 0) return false;
  return { message: "Success" };
};

const getUserByUsername = async (user) => {
  const sql = "SELECT * FROM wsk_users WHERE username = ?";
  const [rows] = await promisePool.execute(sql, [user]);
  if (rows.length === 0) return false;
  return rows[0];
};

const updateUser = async (user, id) => {
  const { name, username, email, password, role } = user;
  let sql = "UPDATE wsk_users SET";

  let setClauses = [];
  if (name) setClauses.push(` name = '${name}'`);
  if (username) setClauses.push(` username = '${username}'`);
  if (email) setClauses.push(` email = '${email}'`);
  if (password) setClauses.push(` password = '${password}'`);
  if (role) setClauses.push(` role = '${role}'`);

  sql += setClauses.join(", ");
  sql += ` WHERE user_id = ${id}`;

  const rows = await promisePool.execute(sql);
  console.log("rows", rows);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  return { message: "success" };
};

const removeUser = async (id) => {
  const [row] = await promisePool.execute(
    "SELECT * FROM wsk_cats WHERE owner = ?",
    [id],
  );
  if (row.length === 0) {
    const [rows] = await promisePool.execute(
      "DELETE FROM wsk_users WHERE user_id = ?",
      [id],
    );
    console.log("rows", rows);
    if (rows.affectedRows === 0) {
      return false;
    }
  } else {
    for (const cat of row) {
      console.log(cat.cat_id);
      const response = await promisePool.execute(
        "UPDATE wsk_cats SET owner = 1 WHERE cat_id = ?",
        [cat.cat_id],
      );
      console.log("Cat changed owner.", response);
    }
    const [rows] = await promisePool.execute(
      "DELETE from wsk_users WHERE user_id = ?",
      [id],
    );
    console.log("rows:", rows);
    if (rows.affectedRows === 0) {
      return false;
    }
  }
  return { message: "User deleted" };
};

const getCatsById = async (id) => {
  const response = await promisePool.execute(
    "SELECT * FROM wsk_cats WHERE owner = ?",
    [id],
  );
  if (response[0].length === 0) {
    return false;
  }
  return response;
};

export {
  listAllUsers,
  addUser,
  findUserById,
  updateUser,
  removeUser,
  getCatsById,
  getUserByUsername,
};
