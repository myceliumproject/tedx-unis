import "dotenv/config";

import cors from "cors";
import express from "express";
import { createServer } from "http";
import morgan from "morgan";
import { Server } from "socket.io";
import eventBlockRouter from "./controllers/eventblock.js";
import userRouter from "./controllers/user.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", process.env.PUBLIC_SITE_URL],
    credentials: true,
  },
});

app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.PUBLIC_SITE_URL],
    credentials: true,
  })
);

app.use("/user", userRouter);
app.use("/eventblock", eventBlockRouter);

io.on("connection", (socket) => {
  console.log("socket connected");

  socket.on("echo", (msg) => {
    io.emit("echo", msg);
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected");
  });
});

app.use((_req, res, _next) => {
  res.status(404).json({ code: -1, message: "Not found", data: null });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  if (
    err &&
    typeof err.status === "number" &&
    err.status >= 400 &&
    err.status <= 499
  ) {
    res.status(err.status).json({ code: -1, message: err.message, data: null });
  } else {
    res
      .status(err?.status ?? 500)
      .json({ code: -1, message: "Unknown error", data: null });
  }
});

server.listen(8080, () => {
  console.log("Listening on *:8080");
});
