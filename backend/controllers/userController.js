const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const genrateToken = require("../config/genrateToken");
const bycrpt = require("bcryptjs");

const registerUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the fields");
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("User already exist");
  }
  const salt = bycrpt.genSaltSync(10);
  const newPassword = await bycrpt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: newPassword,
    pic,
  });

  if (user) {
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: genrateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create new user");
  }
});

const loginUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  console.log("login".america, bycrpt.compareSync(password, user.password));
  if (user && bycrpt.compareSync(password, user.password)) {
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: genrateToken(user._id),
    });
  } else {
    res.status(400).json({ status: "Enter corrent cridentials" });
  }
});

module.exports = { registerUser, loginUser };
