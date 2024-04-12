import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getUserByUsername } from "../models/user-model.js";
import "dotenv/config";

const postLogin = async (req, res) => {
  console.log("postLogin", req.body);
  const user = await getUserByUsername(req.body.username);
  if (!user) {
    res.sendStatus(401);
    return;
  }

  if (!bcrypt.compareSync(req.body.password, user.password)) {
    res.sendStatus(401);
    return;
  }

  delete user.password;

  const token = jwt.sign(user, process.env.SECRETKEY, {
    expiresIn: "24h",
  });
  res.json({ user: user, token });
};

const getMe = async (req, res) => {
  console.log("getMe", res.locals.user);
  if (res.locals.user) {
    res.json({ message: "token ok", user: res.locals.user });
  } else {
    res.sendStatus(401);
  }
};

export { postLogin, getMe };
