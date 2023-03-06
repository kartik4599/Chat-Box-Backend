const express = require("express");

const app = express();

app.get("/chat", (req, res, next) => {
  res.json({ status: "chat" });
  console.log("chat");
  next();
});

app.get("/", (req, res) => {
  res.json([{ status: "going" }]);
  console.log("/");
});

app.listen(5000);
