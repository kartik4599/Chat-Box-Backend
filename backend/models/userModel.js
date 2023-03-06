const mongoose = require("mongoose");

const userModel = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      required: true,
      default:
        "https://i.pinimg.com/originals/35/99/27/359927d1398df943a13c227ae0468357.jpg",
    },
  },
  {
    timeStamps: true,
  }
);

const User = mongoose.model("User", userModel);
