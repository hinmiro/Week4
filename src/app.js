import express from "express";
import api from "./api/index.js";
import authRouter from "./api/routes/auth-router.js";
import { errorHandler, notFoundHandler } from "./middlewares.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public/", express.static("public"));
app.use("/api/v1", api);
app.use("/api/auth", authRouter);
app.use(notFoundHandler);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

export default app;
