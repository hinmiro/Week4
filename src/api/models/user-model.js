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

  const password = rows.map((row) => row.password);

  const iv = Buffer.from(password[0].slice(0, 32), "hex");
  const encryptedPassword = password[0].slice(32);
  const secretKey = Buffer.from(process.env.SECRETKEY, "hex");

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey),
    iv,
  );
  let decryptedPassword = decipher.update(encryptedPassword, "hex", "utf-8");
  decryptedPassword += decipher.final("utf-8");
  console.log("decrypted password:", decryptedPassword);

  console.log("rows: ", rows);
  return rows[0];
};

const addUser = async (user) => {
  const secretKey = process.env.SECRETKEY;
  console.log("key:", secretKey);
  const { name, username, email, role, password } = user;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey, "hex"),
    iv,
  );

  let cryptedPass = cipher.update(password, "utf-8", "hex");
  cryptedPass += cipher.final("hex");
  const encryptedDataWithSalt = iv.toString("hex") + cryptedPass;
  const sql =
    "INSERT INTO wsk_users (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)";
  const params = [
    name || "Unknow",
    username || "Unknow",
    email || "anonmail@dot.com",
    encryptedDataWithSalt || "wordpass",
    role || "user",
  ].map((value) => {
    if (value === undefined) return null;
    else return value;
  });
  const rows = await promisePool.execute(sql, params);
  if (rows[0].affectedRows === 0) return false;
  return { message: "Success" };
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
};
