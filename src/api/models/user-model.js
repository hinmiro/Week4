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

const updateUser = async (body, id, user) => {
  let sql = promisePool.format(`UPDATE wsk_users SET ? WHERE user_id = ?`, [
    body,
    user.user_id,
  ]);

  if (user.role === "admin") {
    sql = promisePool.format("UPDATE wsk_users SET ? WHERE user_id = ?", [
      body,
      id,
    ]);
  }

  try {
    const rows = await promisePool.execute(sql);
    console.log("updateUser", rows);
    if (rows[0].affectedRows === 0) {
      return false;
    }
    return { message: "success" };
  } catch (e) {
    console.error("error", e.message);
    return false;
  }
};

const removeUser = async (id, user) => {
  let [row] = await promisePool.execute(
    "SELECT * FROM wsk_cats WHERE owner = ?",
    [id],
  );
  if (row.length !== 0) {
    for (const cat of row) {
      console.log(cat.cat_id);
      const response = await promisePool.execute(
        "DELETE FROM wsk_cats WHERE cat_id = ?",
        [cat.cat_id],
      );
      console.log("Cat changed owner.", response);
    }
  }

  let sql = promisePool.format("DELETE FROM wsk_users WHERE user_id = ?", [
    user.user_id,
  ]);

  if (user.role === "admin") {
    sql = promisePool.format("DELETE FROM wsk_users WHERE user_id = ?", [id]);
  }

  const [rows] = await promisePool.execute(sql);
  console.log("rows", rows);
  if (rows.affectedRows === 0) {
    return false;
  }
  console.log("rows:", rows);
  if (rows.affectedRows === 0) {
    return false;
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
