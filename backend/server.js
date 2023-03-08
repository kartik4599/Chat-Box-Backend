const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = express();
const userRouter = require("./Routes/userRoutes");
const chatRouter = require("./Routes/chatRoutes");
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

app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT || 1000);
console.log(`started port at ${process.env.PORT || 1000}`.magenta);
