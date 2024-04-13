import express from "express";
import cors from "cors";
import api from "./api/index.js";
import authRouter from "./api/routes/auth-router.js";
import {
  errorHandler,
  notFoundHandler,
  validationErrors,
} from "./middlewares.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));
app.use("/api/v1", api);
app.use("/api/auth", authRouter);
app.use(notFoundHandler);
app.use(errorHandler);
app.use(validationErrors);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

export default app;
