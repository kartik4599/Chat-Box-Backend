const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const protect = expressAsyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.decode(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (e) {
      console.log(e);
      res.status(400);
      throw new Error("Not authorized, token failed");
    }
  }
});

module.exports = protect;
