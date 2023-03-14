const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const socket = require("socket.io");
const app = express();
const userRouter = require("./Routes/userRoutes");
const chatRouter = require("./Routes/chatRoutes");
const messageRouter = require("./Routes/messageRouter");
const { notFound, errorHandler } = require("./middleware/errorMiddlerware");

dotenv.config();
connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.json([{ status: "going" }]);
  console.log("/");
});

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(process.env.PORT || 1000);

const io = socket(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (steam) => {
  console.log("conntected to socket.io".magenta);

  steam.on("setup", (userData) => {
    steam.join(userData.id);
    steam.emit("connected");
  });

  steam.on("join chat", (room) => {
    steam.join(room);
    console.log("User Jointed Room " + room);
  });

  steam.on("typing", (room) => steam.in(room).emit("typing"));

  steam.on("stop typing", (room) => steam.in(room).emit("stop typing"));

  steam.on("new Message", (newMessageRecived) => {
    let chat = newMessageRecived.chat;

    if (!chat.users) return console.log("chat.user not define");

    chat.users.forEach((user) => {
      if (user._id === newMessageRecived.sender._id) return;

      steam.in(user._id).emit("message recieved", newMessageRecived);
    });
  });

  steam.off("setup", () => {
    console.log("USER DISCONNECTED".bgCyan);
    steam.leave(userData.io);
  });
});

// console.log(`started port at ${process.env.PORT || 1000}`.magenta);
