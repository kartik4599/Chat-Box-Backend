const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUser,
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", registerUser);
router.get("/", protect, getAllUser);

router.post("/login", loginUser);

module.exports = router;
