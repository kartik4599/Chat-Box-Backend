const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  postChat,
  getChat,
  createGroup,
  renameGroup,
  addInGroup,
  removeFromGroup
} = require("../controllers/chatController");

const router = express.Router();

router.post("/", protect, postChat);

router.get("/", protect, getChat);

router.post("/group", protect, createGroup);

router.put("/rename", protect, renameGroup);

router.put("/groupremove", protect, removeFromGroup);

router.put("/groupadd", protect, addInGroup);

module.exports = router;
